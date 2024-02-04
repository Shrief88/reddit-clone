import { type RequestHandler } from "express";
import { type CustomRequest } from "./auth";
import prisma from "../config/prisma";
import createHttpError from "http-errors";

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

// @GET /api/v1/users/:username
export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const username = req.params.username;
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        followers: true,
        following: true,
      },
    });

    if (!user) {
      throw createHttpError(404, "User not found");
    }
    res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
};

// @GET /api/v1/users/karma/:username
export const getUserKarma: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: req.params.username,
      },
      include: {
        votes: true,
        commentsVotes: true,
      },
    });

    if (!user) {
      throw createHttpError(404, "User not found");
    }

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

// @PUT /api/v1/users/me/username
export const updateUsername: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const userId = req.user.id;
    const username = req.body.username;

    const userExists = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (userExists) {
      throw createHttpError(409, "User already exists");
    }

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username,
      },
    });

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};
