import { body, param } from "express-validator";

import prisma from "../config/prisma";
import validateMiddleware from "../middlewares/validatorMiddleware";

export const createSubreddit = [
  body("name")
    .notEmpty()
    .withMessage("Subreddit name is required")
    .isString()
    .withMessage("Subreddit name must be a string")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Subreddit name must be at least 3 characters long")
    .isLength({ max: 22 })
    .withMessage("Subreddit name must be at most 20 characters long")
    .custom(async (name) => {
      const subreddit = await prisma.subreddit.findUnique({
        where: {
          name,
        },
      });
      if (subreddit) {
        throw new Error("Subreddit already exists");
      }
    }),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .trim()
    .isLength({ min: 30 })
    .withMessage("Description must be at least 30 characters long")
    .isLength({ max: 200 })
    .withMessage("Description must be at most 200 characters long"),
  validateMiddleware,
];

export const deleteSubreddit = [
  param("id")
    .isUUID()
    .withMessage("Invalid subreddit ID")
    .custom(async (id, { req }) => {
      const subredditOnwer = await prisma.subreddit.findUnique({
        where: { id },
      });
      if (subredditOnwer?.onwerId !== req.user.id) {
        throw new Error("Forbidden");
      }
    }),
];
