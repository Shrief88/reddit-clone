import { cleanEnv, str, port } from "envalid";
import dotenv from "dotenv";

dotenv.config();

const env = cleanEnv(process.env, {
  PORT: port(),
  NODE_ENV: str({ choices: ["development", "test", "production"] }),
  BASE_URL: str(),
  DATABASE_URL: str(),
  DATABASE_CLOUD: str(),

  GOOGLE_CLIENT_ID: str(),
  GOOGLE_CLIENT_SECRET: str(),

  ACCESS_TOKEN_SECRET: str(),

  CLIENT_URL: str(),

  CLOUD_NAME: str(),
  API_KEY: str(),
  API_SECRET: str(),
  MEDIA_HOSTING_URL: str(),
});

export default env;
