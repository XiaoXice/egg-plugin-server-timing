import { ServerTimingOptions } from "../../config/config.default";
import { Context } from "egg";

function nop() {}

class Timer {
  private _times: Map<
    string,
    {
      name: string;
      description?: string;
      start: [number, number];
      value?: number;
    }
  >;
  constructor() {
    this._times = new Map();
  }

  time(name: string, description?: string) {
    this._times.set(name, {
      name,
      description,
      start: process.hrtime(),
    });
  }

  timeEnd(name) {
    const timeObj = this._times.get(name);
    if (!timeObj) {
      return console.warn(`No such name ${name}`);
    }
    const duration = process.hrtime(timeObj.start);
    const value = duration[0] * 1e3 + duration[1] * 1e-6;
    timeObj.value = value;
    this._times.delete(name);
    return timeObj;
  }

  clear() {
    this._times.clear();
  }

  keys() {
    return this._times.keys();
  }
}

export default function (opts: ServerTimingOptions) {
  return async (ctx: Context, next: () => Promise<void>) => {
    if (ctx.serverTimer) {
      throw new Error("ctx.serverTimer already exists.");
    }
    const enabledBefore =
      typeof opts.enabled === "function"
        ? await opts.enabled(ctx)
        : opts.enabled;
    if (enabledBefore) {
      const headers: string[] = [];
      const timer = new Timer();
      ctx.serverTimer = {
        setMetric: setMetric(headers, opts),
        startTime: startTime(timer),
        endTime: endTime(timer, ctx),
      };
      const startAt = process.hrtime();

      await next();

      if (opts.autoEnd) {
        const keys = timer.keys();
        for (const key of keys) {
          ctx.serverTimer.endTime(key);
        }
      }

      if (opts.total) {
        const diff = process.hrtime(startAt);
        const timeSec = diff[0] * 1e3 + diff[1] * 1e-6;
        ctx.serverTimer.setMetric(opts.name, timeSec, opts.description);
      }

      timer.clear();

      const enabledAfter =
        typeof opts.enabled === "function"
          ? await opts.enabled(ctx)
          : opts.enabled;

      if (enabledAfter) {
        ctx.set("Server-Timing", headers);
      }
    } else {
      ctx.serverTimer = {
        setMetric: nop,
        startTime: nop,
        endTime: nop,
      };
      return next();
    }
  };
}

function setMetric(headers: string[], opts: ServerTimingOptions) {
  return (name: string, value: number, description?: string) => {
    if (typeof name !== "string") {
      return console.warn("1st argument name is not string");
    }
    if (typeof value !== "number") {
      return console.warn("2nd argument value is not number");
    }

    const dur = Number.isFinite(opts.precision)
      ? value.toFixed(opts.precision)
      : value;

    const metric =
      typeof description !== "string" || !description
        ? `${name}; dur=${dur}`
        : `${name}; dur=${dur}; desc="${description}"`;

    headers.push(metric);
  };
}

function startTime(timer: Timer) {
  return (name: string, description?: string) => {
    if (typeof name !== "string") {
      return console.warn("1st argument name is not string");
    }

    timer.time(name, description);
  };
}

function endTime(timer: Timer, ctx: Context) {
  return (name: string) => {
    if (typeof name !== "string") {
      return console.warn("1st argument name is not string");
    }

    const obj = timer.timeEnd(name);
    if (!obj?.value) {
      return;
    }
    ctx.serverTimer.setMetric(obj.name, obj.value, obj.description);
  };
}
