import express from "express";

import * as loggedUserHandler from "../handlers/loggedUser";
import * as authHandler from "../handlers/auth";

const userRouter = express.Router();

userRouter.get(
  "/me",
  authHandler.protectRoute,
  loggedUserHandler.getLoggedUser,
);

userRouter.get(
  "/karma/:username",
  authHandler.protectRoute,
  loggedUserHandler.getUserKarma,
);

userRouter.get("/:username", loggedUserHandler.getUser);

export default userRouter;
