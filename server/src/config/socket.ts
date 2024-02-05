import http from "http";

import { Server } from "socket.io";

import allowedOrgins from "./allowedOrgins";
import app from "../app";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrgins,
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

export default io;
