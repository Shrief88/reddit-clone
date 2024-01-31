import { param } from "express-validator";

import prisma from "../config/prisma";
import validateMiddleware from "../middlewares/validatorMiddleware";

export const addUpVote = [
  param("postId")
    .isUUID()
    .withMessage("Invalid post ID")
    .custom(async (postId) => {
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });
      if (!post) {
        throw new Error("Post not found");
      }
    }),
  validateMiddleware,
];

export const addDownVote = [
  param("postId")
    .isUUID()
    .withMessage("Invalid post ID")
    .custom(async (postId) => {
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });
      if (!post) {
        throw new Error("Post not found");
      }
    }),
  validateMiddleware,
];

export const deleteVote = [
  param("postId")
    .isUUID()
    .withMessage("Invalid post ID")
    .custom(async (postId) => {
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });
      if (!post) {
        throw new Error("Post not found");
      }
    }),
  validateMiddleware,
];
