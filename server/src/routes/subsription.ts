import express from "express";

import * as subscriptionHandler from "../handlers/subscription";
import * as authHandler from "../handlers/auth";
import * as subsriptionValidator from "../validators/subsription";

const subscriptionRouter = express.Router();

subscriptionRouter.post(
  "/:id/join",
  authHandler.protectRoute,
  subsriptionValidator.joinSubreddit,
  subscriptionHandler.joinSubreddit,
);

subscriptionRouter.delete(
  "/:id/leave",
  authHandler.protectRoute,
  subsriptionValidator.leaveSubreddit,
  subscriptionHandler.leaveSubreddit,
);

export default subscriptionRouter;
