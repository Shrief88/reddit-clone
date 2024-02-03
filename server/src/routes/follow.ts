import express from "express";

import * as followHandler from "../handlers/follow";
import * as authHandler from "../handlers/auth";
import * as followValidator from "../validators/follow";

const followRouter = express.Router();

followRouter.post(
  "/:userId/",
  authHandler.protectRoute,
  followValidator.follow,
  followHandler.follow,
);

followRouter.delete(
  "/:userId/",
  authHandler.protectRoute,
  followValidator.unfollow,
  followHandler.unfollow,
);

export default followRouter;
