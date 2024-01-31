import { body, param } from "express-validator";

import validateMiddleware from "../middlewares/validatorMiddleware";

export const getPostComments = [
  param("postId").isUUID().withMessage("Invalid post ID"),
  validateMiddleware,
];

export const createComment = [
  param("postId").isUUID().withMessage("Invalid post ID"),
  body("text")
    .notEmpty()
    .withMessage("Text is required")
    .isLength({ max: 1000 })
    .withMessage("Text must be at most 1000 characters long"),
  validateMiddleware,
];
