import { type RequestHandler } from "express";

import { type CustomRequest } from "./auth";
import prisma from "../config/prisma";

export const joinSubreddit: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    await prisma.subscription.create({
      data: {
        userId,
        subredditId: id,
      },
    });
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

export const leaveSubreddit: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    await prisma.subscription.delete({
      where: {
        userId_subredditId: {
          userId,
          subredditId: id,
        },
      },
    });
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
