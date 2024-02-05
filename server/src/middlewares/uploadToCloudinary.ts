import { type RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "../config/cloudinary";

export const uploadToCloudinary = (
  modelName: string,
  path: string,
): RequestHandler => {
  return async (req, res, next) => {
    if (req.file) {
      const fileName = `${modelName}-${uuidv4()}-${Date.now()}`;
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      try {
        await cloudinary.uploader.upload(
          dataURI,
          { public_id: fileName },
          function (error, result) {
            if (error) {
              throw new Error(error.message);
            }
            console.log(result);
          },
        );
        req.body[path] = fileName;
      } catch (err) {
        next(err);
      }
    }
    next();
  };
};
