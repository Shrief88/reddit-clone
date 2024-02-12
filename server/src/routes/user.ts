import express from "express";

import * as loggedUserHandler from "../handlers/loggedUser";
import * as authHandler from "../handlers/auth";
import { uploadImage } from "../middlewares/uploadImageMiddleware";
import { uploadToCloudinary } from "../middlewares/uploadToCloudinary";

const userRouter = express.Router();

userRouter.use(authHandler.protectRoute);

userRouter.get("/me", loggedUserHandler.getLoggedUser);

userRouter.get("/karma/:username", loggedUserHandler.getUserKarma);

userRouter.get(
  "/unreadedNotification",
  loggedUserHandler.getUnreadNotificationsNumber,
);

userRouter.get("/:username", loggedUserHandler.getUser);

userRouter.put("/me/username", loggedUserHandler.updateUsername);

userRouter.put(
  "/me/image",
  uploadImage("image"),
  uploadToCloudinary("user", "image"),
  loggedUserHandler.updateImage,
);

export default userRouter;
