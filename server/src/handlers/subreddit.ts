import { type RequestHandler } from "express";
import prisma from "../config/prisma";
import slugify from "slugify";
import { type CustomRequest } from "./auth";

// @route GET /api/v1/subreddit
// @access Private
export const getSubreddits: RequestHandler = async (req, res, next) => {
  try {
    const subreddits = await prisma.subreddit.findMany();
    res.status(200).json({ data: subreddits });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/v1/subreddit/:slug
// @access Private
export const getSubreddit: RequestHandler = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const subreddit = await prisma.subreddit.findUnique({
      where: {
        slug,
      },
      include: {
        posts: {
          include: {
            author: true,
            votes: true,
            comments: true,
            subreddit: true,
          },
          take: 10,
        },
        subscribers: true,
      },
    });

    if (!subreddit) {
      res.status(404).json({ message: "Subreddit not found" });
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
        slug: slugify(name),
        description: req.body.description,
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
    await prisma.subreddit.delete({
      where: {
        id,
      },
    });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

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
  } catch (err) {
    next(err);
  }
};
