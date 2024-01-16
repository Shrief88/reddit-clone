import { Request, type RequestHandler } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import { createToken } from "../utils/createToken";
import env from "../config/validateEnv";
import prisma from "../config/prisma";
import createHttpError from "http-errors";
import { User } from "@prisma/client";

export interface CustomRequest extends Request {
  user: User;
}

interface jwtObject {
  user_id: string;
  iat: number;
  exp: number;
}

export const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleLoginCallback: RequestHandler = (req, res, next) => {
  passport.authenticate(
    "google",
    { session: false, failureRedirect: "/" },
    (err, user) => {
      if (err || !user) {
        return res
          .status(401)
          .json({ message: "Authentication failed", error: err });
      }
      const token = createToken({ user_id: user.id });
      res.cookie("accessToken", token);
      res.redirect(env.CLIENT_URL);
    },
  )(req, res, next);
};

export const protectRoute: RequestHandler = async (
  req: CustomRequest,
  res,
  next,
) => {
  try {
    let token = "";
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
      if (token) {
        const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
        const user = await prisma.user.findUnique({
          where: {
            id: (decoded as jwtObject).user_id,
          },
        });

        // verify if user exists
        if (!user) {
          throw createHttpError(401, "this user no longer exists");
        }

        req.user = user;
      }
      next();
    }
    if (!token) {
      throw createHttpError(401, "Unauthorized, please login");
    }
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      next(createHttpError(403, "token expired"));
    }
    next(err);
  }
};
