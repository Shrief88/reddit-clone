/* eslint-disable @typescript-eslint/no-unsafe-argument */
import express from "express";

import * as authHandler from "../handlers/auth";

const authRouter = express.Router();

authRouter.get("/google", authHandler.googleLogin);

authRouter.get("/google/callback", authHandler.googleLoginCallback);

authRouter.get("/demoUser", authHandler.loginAsDemoUser);

export default authRouter;
