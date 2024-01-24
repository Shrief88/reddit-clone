import { type RequestHandler } from "express";

const test = (text: string): RequestHandler => {
  return (req, res, next) => {
    console.log(req.body);
    console.log(text);
    next();
  };
};

export default test;
