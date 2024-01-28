import express from "express";

import * as subredditHandler from "../handlers/subreddit";
import * as authHandler from "../handlers/auth";
import * as subredditValidator from "../validators/subreddit";
import postRouter from "./post";

const subredditRouter = express.Router();

subredditRouter.get("/", subredditHandler.getSubreddits);

subredditRouter.use(authHandler.protectRoute);

subredditRouter.get("/:id", subredditHandler.getSubreddit);

subredditRouter.post(
  "/",
  subredditValidator.createSubreddit,
  subredditHandler.createSubreddit,
);

subredditRouter.delete(
  "/:id",
  subredditValidator.deleteSubreddit,
  subredditHandler.deleteSubreddit,
);

subredditRouter.use(
  "/:id/posts",
  subredditValidator.getSubredditPosts,
  postRouter,
);

export default subredditRouter;
