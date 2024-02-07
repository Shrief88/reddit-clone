import express from "express";

import * as postHandler from "../handlers/post";
import * as authHandler from "../handlers/auth";
import * as postValidator from "../validators/post";
import { uploadImage } from "../middlewares/uploadImageMiddleware";
import { uploadToCloudinary } from "../middlewares/uploadToCloudinary";

const postRouter = express.Router({ mergeParams: true });

postRouter.use(authHandler.protectRoute);

postRouter.get("/", postHandler.getPosts);

postRouter.get("/following/me", postHandler.getUserFollowingPosts);

postRouter.get("/saved/me", postHandler.getUserSavedPosts);

postRouter.get("/:id", postValidator.getPost, postHandler.getPost);

postRouter.post(
  "/",
  uploadImage("image"),
  postValidator.createPost,
  uploadToCloudinary("post", "image"),
  postHandler.createPost,
);

postRouter.put(
  "/:id",
  uploadImage("image"),
  postValidator.updatePost,
  uploadToCloudinary("post", "image"),
  postHandler.updatePost,
);

postRouter.delete("/:id", postValidator.deletePost, postHandler.deletePost);

export default postRouter;
