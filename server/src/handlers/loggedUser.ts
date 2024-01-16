import { type RequestHandler } from "express";
import { type CustomRequest } from "./auth";

export const getLoggedUser: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    res.status(200).json({ user: req.user });
    next();
  } catch (err) {
    next(err);
  }
};
