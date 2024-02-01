import { body, param } from "express-validator";

import validateMiddleware from "../middlewares/validatorMiddleware";
import prisma from "../config/prisma";

export const getPostComments = [
  param("postId").isUUID().withMessage("Invalid post ID"),
  validateMiddleware,
];

export const createComment = [
  param("postId")
    .isUUID()
    .withMessage("Invalid post ID")
    .custom(async (id) => {
      const post = await prisma.post.findUnique({
        where: {
          id,
        },
      });
      if (!post) {
        throw new Error("Post not found");
      }
    }),
  body("text")
    .notEmpty()
    .withMessage("Text is required")
    .isLength({ max: 2000 })
    .withMessage("Text must be at most 1000 characters long"),
  body("replyToId")
    .optional()
    .isUUID()
    .withMessage("Invalid comment ID")
    .custom(async (id) => {
      const comment = await prisma.comment.findUnique({
        where: {
          id,
        },
      });
      if (!comment) {
        throw new Error("Comment not found");
      }
    }),
  validateMiddleware,
];

export const updateComment = [
  param("id")
    .isUUID()
    .withMessage("Invalid comment ID")
    .custom(async (id, { req }) => {
      const comment = await prisma.comment.findUnique({
        where: {
          id,
        },
      });
      if (!comment) {
        throw new Error("Comment not found");
      }
      if (comment.authorId !== req.user.id) {
        throw new Error("Forbidden");
      }
      return true;
    }),
  body("text")
    .notEmpty()
    .withMessage("Text is required")
    .isLength({ max: 2000 })
    .withMessage("Text must be at most 1000 characters long"),
  validateMiddleware,
];
