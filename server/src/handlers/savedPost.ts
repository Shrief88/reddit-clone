import { type RequestHandler } from "express";
import prisma from "../config/prisma";
import { type CustomRequest } from "./auth";

export const getUserSavedPosts: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const userId = req.user.id;

    const posts = await prisma.savedPost.findMany({
      where: {
        userId,
      },
    });

    res.status(200).json({ data: posts });
  } catch (err) {
    next(err);
  }
};

export const savePost: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    await prisma.savedPost.create({
      data: {
        userId,
        postId,
      },
    });

    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
};

export const unSavePost: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    await prisma.savedPost.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
