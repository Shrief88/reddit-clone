import { Request, type RequestHandler } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import { createToken } from "../utils/createToken";
import env from "../config/validateEnv";
import prisma from "../config/prisma";
import createHttpError from "http-errors";
import { User } from "@prisma/client";
import queryString from "querystring";

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
      const queryParms = queryString.stringify({
        token,
      })
      res.redirect(`${env.CLIENT_URL}/?${queryParms}`);
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

export const loginAsDemoUser: RequestHandler = async (req, res, next) => {
  try {
    const usersCount = await prisma.user.count({
      where: {
        isDemo: true,
      },
    });

    const newUser = "demoUser" + usersCount;
    console.log(newUser);
    const user = await prisma.user.create({
      data: {
        username: newUser,
        email: newUser + "@gmail.com",
        googleId: uuidv4(),
        image: "",
        isDemo: true,
      },
    });

    const token = createToken({ user_id: user.id as string });
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

export const isDemo: RequestHandler = (req: CustomRequest, res, next) => {
  try {
    if (req.user.isDemo) {
      throw createHttpError(
        403,
        "Forbidden please login with your google account",
      );
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};
