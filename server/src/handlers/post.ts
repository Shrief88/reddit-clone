import { type RequestHandler } from "express";
import prisma from "../config/prisma";
import createHttpError from "http-errors";
import { type CustomRequest } from "./auth";

export const getPosts: RequestHandler = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    let filterObject = {};
    if (req.query.subredditId) {
      filterObject = {
        subredditId: req.query.subredditId,
      };
    }

    if (req.query.authorId) {
      filterObject = {
        authorId: req.query.authorId,
      };
    }

    const posts = await prisma.post.findMany({
      take: limit,
      skip: (page - 1) * limit,
      include: {
        subreddit: true,
        author: true,
        comments: true,
        votes: true,
      },
      where: filterObject,
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json({ data: posts });
  } catch (err) {
    next(err);
  }
};

export const getUserFollowingPosts: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const followingSubreddits = await prisma.subscription.findMany({
      where: {
        userId: req.user.id,
      },
    });

    const followingUsers = await prisma.follows.findMany({
      where: {
        followerId: req.user.id,
      },
    });

    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: (page - 1) * limit,
      include: {
        author: true,
        subreddit: true,
        comments: true,
        votes: true,
      },

      where: {
        OR: [
          {
            subredditId: {
              in: followingSubreddits.map((sub) => sub.subredditId),
            },
          },
          {
            authorId: {
              in: followingUsers.map((user) => user.followingId),
            },
          },
        ],
      },
    });

    res.status(200).json({ data: posts });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getUserSavedPosts: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const savedPosts = await prisma.savedPost.findMany({
      where: {
        userId: req.user.id,
      },
    });

    const posts = await prisma.post.findMany({
      take: limit,
      skip: (page - 1) * limit,
      include: {
        author: true,
        subreddit: true,
        comments: true,
        votes: true,
      },

      where: {
        id: {
          in: savedPosts.map((post) => post.postId),
        },
      },
    });

    res.status(200).json({ data: posts });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getPost: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
        subreddit: true,
        comments: { include: { author: true, votes: true } },
        votes: true,
        savedBy: true,
      },
    });
    if (!post) {
      throw createHttpError(404, "Post not found");
    }
    res.status(200).json({ data: post });
  } catch (err) {
    next(err);
  }
};

export const createPost: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    req.body.authorId = req.user.id;
    const post = await prisma.post.create({
      data: req.body,
    });

    await prisma.vote.create({
      data: {
        userId: req.user.id,
        postId: post.id,
        type: "upvote",
      },
    });

    res.status(201).json({ data: post });
  } catch (err) {
    next(err);
  }
};

export const updatePost: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    const id = req.params.id;
    if (req.body.image === "") {
      req.body.image = null;
    }
    const post = await prisma.post.update({
      where: {
        id,
      },
      data: req.body,
    });
    res.status(200).json({ data: post });
  } catch (err) {
    next(err);
  }
};

export const deletePost: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    await prisma.post.delete({
      where: {
        id,
      },
    });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
