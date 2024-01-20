import { param } from "express-validator";

import prisma from "../config/prisma";
import validateMiddleware from "../middlewares/validatorMiddleware";

export const joinSubreddit = [
  param("id")
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
    })
    .custom(async (id, { req }) => {
      const subscription = await prisma.subscription.findUnique({
        where: {
          userId_subredditId: {
            userId: req.user.id,
            subredditId: id,
          },
        },
      });
      if (subscription) {
        throw new Error("Already subscribed");
      }
    }),
  validateMiddleware,
];

export const leaveSubreddit = [
  param("id")
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
