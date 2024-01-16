import express from "express";

import * as loggedUserHandler from "../handlers/loggedUser";
import * as authHandler from "../handlers/auth";

const userRouter = express.Router();

userRouter.get(
  "/me",
  authHandler.protectRoute,
  loggedUserHandler.getLoggedUser,
);

export default userRouter;
