import { type RequestHandler } from "express";
import { type CustomRequest } from "./auth";
import prisma from "../config/prisma";

// @route GET /api/v1/comment/:postId
export const getPostComments: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const postId = req.params.postId;
    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        author: true,
        votes: true,
      },
    });

    res.status(200).json({ data: comments });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/v1/comment/:postId
export const createComment: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;
    const comment = await prisma.comment.create({
      data: {
        authorId: userId,
        postId,
        text: req.body.text,
        replyToId: req.body.replyToId || null,
      },
    });

    await prisma.commentVote.create({
      data: {
        commentId: comment.id,
        userId,
        type: "upvote",
      },
    });

    res.status(201).json({ data: comment });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/v1/comment/:id
export const updateComment: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const comment = await prisma.comment.update({
      where: {
        id,
      },
      data: {
        text: req.body.text,
      },
    });
    res.status(200).json({ data: comment });
  } catch (err) {
    next(err);
  }
};

export const deleteComment: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    await prisma.comment.delete({
      where: {
        id,
      },
    });
    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
