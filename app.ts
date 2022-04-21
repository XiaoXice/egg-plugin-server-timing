import { Application } from "egg";

export default (app: Application) => {
  app.config.coreMiddleware.push("serverTiming");
};
