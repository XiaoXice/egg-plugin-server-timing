import mm from "egg-mock";
import assert from "assert";
import { ServerTimingOptions } from "config/config.default";

describe("index", async () => {
  afterEach(mm.restore);

  it("should work", async () => {
    const app = mm.app({ baseDir: "app" });
    await app.ready();
    const res = await app.httpRequest().get("/");
    assert(res.header["server-timing"]);
  });

  it("should stop work", async () => {
    const app = mm.app({ baseDir: "app" });
    app.config.serverTiming.enabled = false;
    await app.ready();
    const res = await app.httpRequest().get("/");
    assert(!res.header["server-timing"]);
  });

  it("should work with function", async () => {
    const app = mm.app({ baseDir: "app" });
    app.config.serverTiming.enabled = () => true;
    await app.ready();
    const res = await app.httpRequest().get("/");
    assert(res.header["server-timing"]);
  });

  it("should not work with function", async () => {
    const app = mm.app({ baseDir: "app" });
    app.config.serverTiming.enabled = () => false;
    await app.ready();
    const res = await app.httpRequest().get("/");
    assert(!res.header["server-timing"]);
    app.config.serverTiming.enabled = (ctx) =>
      ctx.state.passFirst ? false : (ctx.state.passFirst = true);
    const res2 = await app.httpRequest().get("/");
    assert(!res2.header["server-timing"]);
  });
});
