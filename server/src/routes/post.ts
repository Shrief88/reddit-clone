import express from "express";

import * as postHandler from "../handlers/post";
import * as authHandler from "../handlers/auth";
import * as postValidator from "../validators/post";
import { uploadImage } from "../middlewares/uploadImageMiddleware";
import { resizeImage } from "../middlewares/resizeImagemiddleware";

const postRouter = express.Router({ mergeParams: true });

postRouter.use(authHandler.protectRoute);

postRouter.get("/", postHandler.getPosts);

postRouter.get("/following/me", postHandler.getUserFollowingPosts);

postRouter.get("/:id", postValidator.getPost, postHandler.getPost);

postRouter.post(
  "/",
  uploadImage("image"),
  postValidator.createPost,
  resizeImage("post", "image"),
  postHandler.createPost,
);

postRouter.delete("/:id", postValidator.deletePost, postHandler.deletePost);

export default postRouter;
