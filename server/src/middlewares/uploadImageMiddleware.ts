import multer, { type FileFilterCallback } from "multer";
import createHttpError from "http-errors";
import { type Request, type RequestHandler } from "express";

const multerConfig = (): multer.Multer => {
  const storage = multer.memoryStorage();
  const multerFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ): void => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(createHttpError(400, "Only images are allowed"));
    }
  };

  const upload = multer({ storage, fileFilter: multerFilter });
  return upload;
};

export const uploadImage = (path: string): RequestHandler => {
  return multerConfig().single(path);
};
