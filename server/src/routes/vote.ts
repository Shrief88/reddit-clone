import express from "express";

import * as voteHandler from "../handlers/vote";
import * as authHandler from "../handlers/auth";
import * as voteValidator from "../validators/vote";

const voteRouter = express.Router();

voteRouter.use(authHandler.protectRoute);

voteRouter.post(
  "/:postId/upvote",
  voteValidator.addUpVote,
  voteHandler.addUpVote,
);

voteRouter.post(
  "/:postId/downvote",
  voteValidator.addDownVote,
  voteHandler.addDownVote,
);

voteRouter.delete("/:id", voteValidator.deleteVote, voteHandler.deleteVote);

export default voteRouter;
