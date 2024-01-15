import express from "express";
import cors from "cors";
import morgan from "morgan";

import env from "./config/validateEnv";
import allowedOrgins from "./config/allowedOrgins";
import errorMiddleware from "./middlewares/errorMiddleware";

const app = express();

const corsOptions = {
  origin: function (origin: string, callback: any) {
    if (!origin || allowedOrgins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

if (env.isDevelopment) {
  app.use(morgan("dev"));
}

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.use(errorMiddleware);

export default app;
