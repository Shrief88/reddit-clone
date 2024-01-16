import jwt from "jsonwebtoken";

import env from "../config/validateEnv";

interface PayloadObject {
  user_id: string;
}

export const createToken = (payload: PayloadObject): string => {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};
