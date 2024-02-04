import { body, param } from "express-validator";

import prisma from "../config/prisma";
import validateMiddleware from "../middlewares/validatorMiddleware";

export const getPost = [
  param("id").isUUID().withMessage("Invalid post ID"),
  validateMiddleware,
];

export const createPost = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Title must be at least 5 characters long")
    .isLength({ max: 120 })
    .withMessage("Title must be at most 120 characters long"),
  body("content").optional(),
  body("subredditId")
    .notEmpty()
    .withMessage("Subreddit ID is required")
    .isUUID()
    .withMessage("Invalid subreddit ID")
    .custom(async (id) => {
      const subreddit = await prisma.subreddit.findUnique({
        where: {
          id,
        },
      });
      if (!subreddit) {
        throw new Error("Subreddit not found");
      }
    }),
  validateMiddleware,
];

export const updatePost = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Title must be at least 5 characters long")
    .isLength({ max: 120 })
    .withMessage("Title must be at most 120 characters long"),
  body("content").optional(),
  param("id")
    .isUUID()
    .withMessage("Invalid post ID")
    .custom(async (id, { req }) => {
      const post = await prisma.post.findUnique({
        where: {
          id,
        },
        include: {
          subreddit: true,
        },
      });
      if (!post) {
        throw new Error("Comment not found");
      }

      if (post.authorId !== req.user.id) {
        throw new Error("Forbidden");
      }
      return true;
    }),
  validateMiddleware,
];

export const deletePost = [
  param("id")
    .isUUID()
    .withMessage("Invalid post ID")
    .custom(async (id, { req }) => {
      const post = await prisma.post.findUnique({
        where: {
          id,
        },
        include: {
          subreddit: true,
        },
      });
      if (!post) {
        throw new Error("Comment not found");
      }

      if (
        post.authorId !== req.user.id &&
        post.subreddit.onwerId !== req.user.id
      ) {
        throw new Error("Forbidden");
      }
      return true;
    }),
  validateMiddleware,
];
