import { type NextFunction, type Request, type Response } from "express";

export const setFilterObject = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let filterObject = {};
  if (req.params.subredditId) {
    filterObject = {
      subredditId: req.params.productId,
    };
  }
  req.body.filterObject = filterObject;
  next();
};
