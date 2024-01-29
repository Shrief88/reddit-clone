import { type RequestHandler } from "express";
import { type CustomRequest } from "./auth";
import prisma from "../config/prisma";

export const deleteVote: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    await prisma.vote.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// @route POST /api/v1/vote/:postId/upvote
export const addUpVote: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const vote = await prisma.vote.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (vote) {
      if (vote.type === "downvote") {
        await prisma.vote.delete({
          where: {
            userId_postId: {
              userId,
              postId,
            },
          },
        });
      } else {
        res.status(409).json({ message: "Already voted" });
      }
    }

    await prisma.vote.create({
      data: {
        userId,
        postId,
        type: "upvote",
      },
    });

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// @route POST /api/v1/vote/:postId/downvote
export const addDownVote: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const vote = await prisma.vote.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (vote) {
      if (vote.type === "upvote") {
        await prisma.vote.delete({
          where: {
            userId_postId: {
              userId,
              postId,
            },
          },
        });
      } else {
        res.status(409).json({ message: "Already voted" });
      }
    }

    await prisma.vote.create({
      data: {
        userId,
        postId,
        type: "downvote",
      },
    });

    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
};
