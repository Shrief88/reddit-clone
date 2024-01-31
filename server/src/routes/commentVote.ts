import express from "express";

import * as commentVoteHandler from "../handlers/commentVote";
import * as commentVoteValidator from "../validators/commentVote";
import * as authHandler from "../handlers/auth";

const commentVoteRouter = express.Router();

commentVoteRouter.use(authHandler.protectRoute);

commentVoteRouter.post(
  "/:commentId/upvote",
  commentVoteValidator.addUpVote,
  commentVoteHandler.addUpVote,
);

commentVoteRouter.post(
  "/:commentId/downVote",
  commentVoteValidator.addDownVote,
  commentVoteHandler.addDownVote,
);

commentVoteRouter.delete(
  "/:commentId",
  commentVoteValidator.deleteVote,
  commentVoteHandler.deleteVote,
);

export default commentVoteRouter;
