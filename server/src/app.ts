import path from "path";

import express from "express";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";

import env from "./config/validateEnv";
import allowedOrgins from "./config/allowedOrgins";
import errorMiddleware from "./middlewares/errorMiddleware";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import "./config/passport";
import subredditRouter from "./routes/subreddit";
import subscriptionRouter from "./routes/subsription";
import postRouter from "./routes/post";

const app = express();

const corsOptions = {
  origin: function (origin: string, callback: any) {
    if (!origin || allowedOrgins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

if (env.isDevelopment) {
  app.use(morgan("dev"));
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());

app.use(express.static(path.join(__dirname, "..", "uploads")));

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subreddit", subredditRouter);
app.use("/api/v1/subscription", subscriptionRouter);
app.use("/api/v1/post", postRouter);

app.use(errorMiddleware);

export default app;
