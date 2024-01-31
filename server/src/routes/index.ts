import { type Express } from "express";

import authRouter from "./auth";
import commentRouter from "./comment";
import postRouter from "./post";
import subredditRouter from "./subreddit";
import subscriptionRouter from "./subsription";
import userRouter from "./user";
import voteRouter from "./vote";

const mountRoutes = (app: Express): void => {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/subreddit", subredditRouter);
  app.use("/api/v1/subscription", subscriptionRouter);
  app.use("/api/v1/post", postRouter);
  app.use("/api/v1/vote", voteRouter);
  app.use("/api/v1/comment", commentRouter);
};

export default mountRoutes;
