import { type RequestHandler } from "express";
import prisma from "../config/prisma";
import { type CustomRequest } from "./auth";

// @route GET /api/v1/subreddits
// @access Private
export const getSubreddits: RequestHandler = async (req, res, next) => {
  try {
    const subreddits = await prisma.subreddit.findMany();
    res.status(200).json({ data: subreddits });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/v1/subreddits/:id
// @access Private
export const getSubreddit: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const subreddit = await prisma.subreddit.findUnique({
      where: {
        id,
      },
    });
    res.status(200).json({ data: subreddit });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/v1/subreddits
// @access Private
export const createSubreddit: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const { name } = req.body;
    const subreddit = await prisma.subreddit.create({
      data: {
        name,
        onwerId: req.user.id,
      },
    });
    res.status(201).json({ data: subreddit });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/v1/subreddits/:id
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
