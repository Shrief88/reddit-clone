import { type RequestHandler } from "express";
import prisma from "../config/prisma";
import { type CustomRequest } from "./auth";
import createHttpError from "http-errors";

// @route GET /api/v1/subreddit
// @access Private
export const getSubreddits: RequestHandler = async (req, res, next) => {
  try {
    const subreddits = await prisma.subreddit.findMany({
      include: {
        subscribers: true,
      },
    });
    res.status(200).json({ data: subreddits });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/v1/subreddit/:id
// @access Private
export const getSubreddit: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const subreddit = await prisma.subreddit.findUnique({
      where: {
        id,
      },
      include: {
        posts: {
          include: {
            author: true,
            votes: true,
            comments: true,
          },
          take: 10,
        },
        subscribers: true,
      },
    });

    if (!subreddit) {
      throw createHttpError(404, "Subreddit not found");
    }
    res.status(200).json({ data: subreddit });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/v1/subreddit
// @access Private
export const createSubreddit: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    let name = req.body.name as string;
    name = name.slice(2, name.length);
    const subreddit = await prisma.subreddit.create({
      data: {
        name,
        onwerId: req.user.id,
        description: req.body.description,
        subscribers: {
          create: {
            userId: req.user.id,
          },
        },
      },
    });
    res.status(201).json({ data: subreddit });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/v1/subreddit/:id
// @access Private
export const deleteSubreddit: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deleteSubreddit = prisma.subreddit.delete({
      where: {
        id,
      },
    });

    const deleteSubscribers = prisma.subscription.deleteMany({
      where: {
        subredditId: id,
      },
    });

    await prisma.$transaction([deleteSubscribers, deleteSubreddit]);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
