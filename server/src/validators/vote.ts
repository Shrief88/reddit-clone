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
    })
    .custom(async (postId, { req }) => {
      const vote = await prisma.vote.findUnique({
        where: {
          userId_postId: {
            userId: req.user.id,
            postId,
          },
        },
      });
      if (vote?.type === "upvote") {
        throw new Error("Already upvoted");
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
    })
    .custom(async (postId, { req }) => {
      const vote = await prisma.vote.findUnique({
        where: {
          userId_postId: {
            userId: req.user.id,
            postId,
          },
        },
      });
      if (vote?.type === "downvote") {
        throw new Error("Already downvoted");
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
