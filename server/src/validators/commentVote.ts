import { param } from "express-validator";

import prisma from "../config/prisma";
import validateMiddleware from "../middlewares/validatorMiddleware";

export const addUpVote = [
  param("commentId")
    .isUUID()
    .withMessage("Invalid Comment ID")
    .custom(async (commentId) => {
      const comment = await prisma.comment.findUnique({
        where: {
          id: commentId,
        },
      });
      if (!comment) {
        throw new Error("Comment not found");
      }
    }),
  validateMiddleware,
];

export const addDownVote = [
  param("commentId")
    .isUUID()
    .withMessage("Invalid comment ID")
    .custom(async (commentId) => {
      const comment = await prisma.comment.findUnique({
        where: {
          id: commentId,
        },
      });
      if (!comment) {
        throw new Error("Comment not found");
      }
    }),
  validateMiddleware,
];

export const deleteVote = [
  param("commentId")
    .isUUID()
    .withMessage("Invalid comment ID")
    .custom(async (commentId) => {
      const comment = await prisma.comment.findUnique({
        where: {
          id: commentId,
        },
      });
      if (!comment) {
        throw new Error("Comment not found");
      }
    }),
  validateMiddleware,
];
