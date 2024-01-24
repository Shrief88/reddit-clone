import { type RequestHandler } from "express";
import prisma from "../config/prisma";
import createHttpError from "http-errors";
import { type CustomRequest } from "./auth";

export const getPosts: RequestHandler = async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany();
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
