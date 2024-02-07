import express from "express";

import * as savedPostHandler from "../handlers/savedPost";
import * as authHandler from "../handlers/auth";
import * as savedPostValidator from "../validators/savedPosts";

const savedPostRouter = express.Router();

savedPostRouter.get(
  "/",
  authHandler.protectRoute,
  savedPostHandler.getUserSavedPosts,
);

savedPostRouter.post(
  "/:postId",
  authHandler.protectRoute,
  savedPostValidator.savePost,
  savedPostHandler.savePost,
);

savedPostRouter.delete(
  "/:postId",
  authHandler.protectRoute,
  savedPostValidator.unSavePost,
  savedPostHandler.unSavePost,
);

export default savedPostRouter;
