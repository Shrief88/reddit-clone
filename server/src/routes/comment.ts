import express from "express";

import * as commentHandler from "../handlers/comment";
import * as commentValidator from "../validators/comment";
import * as authHandler from "../handlers/auth";

const commentRouter = express.Router();

commentRouter.get(
  "/:postId",
  authHandler.protectRoute,
  commentValidator.getPostComments,
  commentHandler.getPostComments,
);

commentRouter.post(
  "/:postId",
  authHandler.protectRoute,
  commentValidator.createComment,
  commentHandler.createComment,
);

export default commentRouter;
