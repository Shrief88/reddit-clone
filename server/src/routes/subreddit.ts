import express from "express";

import * as subredditHandler from "../handlers/subreddit";
import * as subredditValidator from "../validators/subreddit";
import * as authHandler from "../handlers/auth";

const subredditRouter = express.Router();

subredditRouter.get("/", subredditHandler.getSubreddits);

subredditRouter.use(authHandler.protectRoute);

subredditRouter.get("/:id", subredditHandler.getSubreddit);

subredditRouter.post(
  "/",
  subredditValidator.createSubreddit,
  subredditHandler.createSubreddit,
);

subredditRouter.put(
  "/:id",
  subredditValidator.updateSubreddit,
  subredditHandler.updateSubreddit,
);

subredditRouter.delete(
  "/:id",
  subredditValidator.deleteSubreddit,
  subredditHandler.deleteSubreddit,
);

export default subredditRouter;
