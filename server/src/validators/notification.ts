import { param } from "express-validator";
import validateMiddleware from "../middlewares/validatorMiddleware";
import prisma from "../config/prisma";

export const updateNotification = [
  param("id")
    .isUUID()
    .withMessage("Invalid notification ID")
    .custom(async (id, { req }) => {
      const notification = await prisma.notification.findUnique({
        where: {
          id,
        },
      });
      if (!notification) {
        throw new Error("Notification not found");
      }

      if (notification.receiverId !== req.user.id) {
        throw new Error("Forbidden");
      }
      return true;
    }),
  validateMiddleware,
];
