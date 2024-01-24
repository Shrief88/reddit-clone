import express from "express";

import * as postHandler from "../handlers/post";
import * as authHandler from "../handlers/auth";
import * as postValidator from "../validators/post";
import { uploadImage } from "../middlewares/uploadImageMiddleware";
import { resizeImage } from "../middlewares/resizeImagemiddleware";
import test from "../middlewares/testMiddleware";

const postRouter = express.Router();

postRouter.get("/", authHandler.protectRoute, postHandler.getPosts);

postRouter.get(
  "/:id",
  postValidator.getPost,
  authHandler.protectRoute,
  postHandler.getPost,
);

postRouter.post(
  "/",
  authHandler.protectRoute,
  uploadImage("image"),
  postValidator.createPost,
  resizeImage("post", "image"),
  postHandler.createPost,
);

export default postRouter;
