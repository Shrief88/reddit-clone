import { type RequestHandler } from "express";
import { type CustomRequest } from "./auth";
import prisma from "../config/prisma";

// @route POST /api/v1/follow/:userId
export const follow: RequestHandler = async (req: CustomRequest, res, next) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.userId;

    await prisma.follows.create({
      data: {
        followerId,
        followingId,
      },
    });

    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/v1/follow/:userId
export const unfollow: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.userId;

    await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
