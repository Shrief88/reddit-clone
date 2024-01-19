import { type NextFunction, type Response, type Request } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

const validateMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message: string = errors.array()[0].msg;
    if (message.includes("not exist")) {
      next(createHttpError(404, message));
    } else if (message.includes("already")) {
      next(createHttpError(409, message));
    } else if (message.includes("Forbidden")) {
      next(createHttpError(403, message));
    } else {
      next(createHttpError(400, message));
    }
  }
  next();
};

export default validateMiddleware;
