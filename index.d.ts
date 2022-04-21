import { ServerTimingOptions } from "./config/config.default";
import "egg";
import "./typings/ets";

declare module "egg" {
  interface EggAppConfig {
    serverTiming: ServerTimingOptions;
  }
  interface Context {
    serverTimer: {
      setMetric: (name: string, value: number, description?: string) => void;
      startTime: (name: string, description?: string) => void;
      endTime: (name: string) => void;
    };
  }
}
