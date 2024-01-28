import { type RequestHandler } from "express";
import prisma from "../config/prisma";
import createHttpError from "http-errors";
import { type CustomRequest } from "./auth";

export const getPosts: RequestHandler = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const filterObject = req.body.filterObject as Record<string, unknown>;
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
    });
    res.status(200).json({ data: posts });
  } catch (err) {
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
    console.log(req.body);
    console.log("HERE");
    req.body.authorId = req.user.id;
    const post = await prisma.post.create({
      data: req.body,
    });
    res.status(201).json({ data: post });
  } catch (err) {
    next(err);
  }
};
