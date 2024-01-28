import express from "express";

import * as postHandler from "../handlers/post";
import * as authHandler from "../handlers/auth";
import * as postValidator from "../validators/post";
import { uploadImage } from "../middlewares/uploadImageMiddleware";
import { resizeImage } from "../middlewares/resizeImagemiddleware";
import { setFilterObject } from "../middlewares/subredditToPost";

const postRouter = express.Router({ mergeParams: true });

postRouter.use(authHandler.protectRoute);

postRouter.get("/", setFilterObject, postHandler.getPosts);

postRouter.get(
  "/:id",
  postValidator.getPost,
  authHandler.protectRoute,
  postHandler.getPost,
);

postRouter.post(
  "/",
  uploadImage("image"),
  postValidator.createPost,
  resizeImage("post", "image"),
  postHandler.createPost,
);

export default postRouter;
