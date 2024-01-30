import { type NextFunction, type Request, type Response } from "express";

export const setFilterObject = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let filterObject = {};
  if (req.query.subredditId) {
    filterObject = {
      subredditId: req.query.subredditId,
    };
  }
  req.body.filterObject = filterObject;
  next();
};
