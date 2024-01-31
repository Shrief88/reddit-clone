import path from "path";

import express from "express";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";

import env from "./config/validateEnv";
import allowedOrgins from "./config/allowedOrgins";
import errorMiddleware from "./middlewares/errorMiddleware";
import "./config/passport";
import mountRoutes from "./routes";

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

mountRoutes(app);

app.use(errorMiddleware);

export default app;
