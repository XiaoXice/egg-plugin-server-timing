import { Application, Context } from "egg";

export default function (app: Application) {
  app.router.all("all", '/', async (ctx: Context) => {
    ctx.serverTimer.startTime("all");
    await new Promise(resolve => setTimeout(resolve, 100));
    ctx.serverTimer.endTime("all");
  })
}