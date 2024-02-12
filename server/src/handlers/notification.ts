import { type RequestHandler } from "express";
import { type CustomRequest } from "./auth";
import prisma from "../config/prisma";

export const getUserNotification: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const notifications = await prisma.notification.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        receiverId: req.user.id,
      },
      take: limit,
      skip: (page - 1) * limit,
      include: {
        sender: true,
        type: true,
      },
    });
    res.status(200).json({ data: notifications });
  } catch (err) {
    next(err);
  }
};

export const updateAllNotification: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    await prisma.notification.updateMany({
      where: {
        receiverId: req.user.id,
      },
      data: {
        seen: true,
      },
    });
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

export const updateNotification: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const id = req.params.id;

    await prisma.notification.update({
      where: {
        id,
      },
      data: {
        seen: true,
      },
    });
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
