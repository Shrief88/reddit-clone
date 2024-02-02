import { type RequestHandler } from "express";
import { type CustomRequest } from "./auth";
import prisma from "../config/prisma";

export const getLoggedUser: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (err) {
    next(err);
  }
};

export const getUserKarma: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        votes: true,
        commentsVotes: true,
      },
    });

    let karma = 0;

    if (user) {
      user.votes.forEach((vote) => {
        if (vote.type === "upvote") karma++;
        else karma--;
      });

      user.commentsVotes.forEach((vote) => {
        if (vote.type === "upvote") karma++;
        else karma--;
      });

      res.status(200).json({ karma });
    }
  } catch (err) {
    next(err);
  }
};
