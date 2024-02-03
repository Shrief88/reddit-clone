import { param } from "express-validator";
import prisma from "../config/prisma";

export const follow = [
  param("userId")
    .isUUID()
    .withMessage("Invalid user ID")
    .custom(async (userId, { req }) => {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const follow = await prisma.follows.findUnique({
        where: {
          followerId_followingId: {
            followerId: req.user.id,
            followingId: userId,
          },
        },
      });

      if (follow) {
        throw new Error("Already followed");
      }
      return true;
    }),
];

export const unfollow = [
  param("userId")
    .isUUID()
    .withMessage("Invalid user ID")
    .custom(async (userId, { req }) => {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return true;
    }),
];
