import { type Request, type Response, type NextFunction } from "express";
import { isHttpError } from "http-errors";

import env from "../config/validateEnv";

const errorMiddleware = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let errorMessage = "Something went wrong!";
  let statusCode = 500;
  let stack: string | undefined = "";
  if (isHttpError(error)) {
    statusCode = error.statusCode;
    errorMessage = error.message;
    stack = error.stack;
  } else {
    errorMessage = error as string;
  }

  if (env.isProduction) {
    res.status(statusCode).json({ message: errorMessage });
  } else {
    res.status(statusCode).json({ message: errorMessage, stack });
  }
};

export default errorMiddleware;
