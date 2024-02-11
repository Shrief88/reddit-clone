import express from "express";

import * as notificationHandler from "../handlers/notification";
import * as authHandler from "../handlers/auth";
import * as notificationValidator from "../validators/notification";

const notificationRouter = express.Router();

notificationRouter.use(authHandler.protectRoute);

notificationRouter.get("/", notificationHandler.getUserNotification);

notificationRouter.put("/", notificationHandler.updateAllNotification);

notificationRouter.put(
  "/:id",
  notificationValidator.updateNotification,
  notificationHandler.updateNotification,
);

export default notificationRouter;
