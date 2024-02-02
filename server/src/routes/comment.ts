import express from "express";

import * as commentHandler from "../handlers/comment";
import * as commentValidator from "../validators/comment";
import * as authHandler from "../handlers/auth";

const commentRouter = express.Router();

commentRouter.use(authHandler.protectRoute);

commentRouter.get(
  "/:postId",
  commentValidator.getPostComments,
  commentHandler.getPostComments,
);

commentRouter.post(
  "/:postId",
  commentValidator.createComment,
  commentHandler.createComment,
);

commentRouter.put(
  "/:id",
  commentValidator.updateComment,
  commentHandler.updateComment,
);

commentRouter.delete(
  "/:id",
  commentValidator.deleteComment,
  commentHandler.deleteComment,
);

export default commentRouter;
