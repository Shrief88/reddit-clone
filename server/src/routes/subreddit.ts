import express from "express";

import * as subredditHandler from "../handlers/subreddit";
import * as authHandler from "../handlers/auth";
import * as subredditValidator from "../validators/subreddit";

const subredditRouter = express.Router();

subredditRouter.use(authHandler.protectRoute);

subredditRouter.get("/", subredditHandler.getSubreddits);

subredditRouter.get(
  "/:id",
  subredditValidator.getSubreddit,
  subredditHandler.getSubreddit,
);

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

export default subredditRouter;
