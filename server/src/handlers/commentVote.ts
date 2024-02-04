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
    const commentId = req.params.commentId;

    await prisma.commentVote.delete({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// @route POST /api/v1/commentVote/:commentId/upvote
export const addUpVote: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const userId = req.user.id;
    const commentId = req.params.commentId;

    const vote = await prisma.commentVote.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });

    if (vote) {
      if (vote.type === "downvote") {
        await prisma.commentVote.delete({
          where: {
            userId_commentId: {
              userId,
              commentId,
            },
          },
        });
      } else {
        res.status(409).json({ message: "Already voted" });
      }
    }

    await prisma.commentVote.create({
      data: {
        userId,
        commentId,
        type: "upvote",
      },
    });

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// @route POST /api/v1/commentVote/:commentId/downvote
export const addDownVote: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const userId = req.user.id;
    const commentId = req.params.commentId;

    const vote = await prisma.commentVote.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });

    if (vote) {
      if (vote.type === "upvote") {
        await prisma.commentVote.delete({
          where: {
            userId_commentId: {
              userId,
              commentId,
            },
          },
        });
      } else {
        res.status(409).json({ message: "Already voted" });
      }
    }

    await prisma.commentVote.create({
      data: {
        userId,
        commentId,
        type: "downvote",
      },
    });

    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
};
