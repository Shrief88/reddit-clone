import { param } from "express-validator";

import validateMiddleware from "../middlewares/validatorMiddleware";
import prisma from "../config/prisma";

export const savePost = [
  param("postId")
    .isUUID()
    .withMessage("Invalid post ID")
    .custom(async (id, { req }) => {
      const post = await prisma.post.findUnique({
        where: {
          id,
        },
      });
      if (!post) {
        throw new Error("Post not found");
      }

      const savedPost = await prisma.savedPost.findUnique({
        where: {
          userId_postId: {
            userId: req.user.id,
            postId: id,
          },
        },
      });

      if (savedPost) {
        throw new Error("Post already saved");
      }
      return true;
    }),
  validateMiddleware,
];

export const unSavePost = [
  param("postId")
    .isUUID()
    .withMessage("Invalid post ID")
    .custom(async (id, { req }) => {
      const post = await prisma.post.findUnique({
        where: {
          id,
        },
      });
      if (!post) {
        throw new Error("Post not found");
      }

      const savedPost = await prisma.savedPost.findUnique({
        where: {
          userId_postId: {
            userId: req.user.id,
            postId: id,
          },
        },
      });

      if (!savedPost) {
        throw new Error("Post already un-saved");
      }
      return true;
    }),
  validateMiddleware,
];
