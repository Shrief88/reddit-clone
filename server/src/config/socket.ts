import http from "http";

import { Server } from "socket.io";

import allowedOrgins from "./allowedOrgins";
import app from "../app";
import prisma from "./prisma";
import { type NotificationTypeNames } from "@prisma/client";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrgins,
  },
});

type OnlineUser = Record<string, string>;

let OnlineUsers: OnlineUser[] = [];

const addNewUser = (username: string, socketId: string): void => {
  if (!OnlineUsers.some((user) => user.username === username)) {
    OnlineUsers.push({ username, socketId });
  }
};

const deleteUser = (socketId: string): void => {
  OnlineUsers = OnlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username: string): OnlineUser | undefined => {
  return OnlineUsers.find((user) => user.username === username);
};

io.on("connection", (socket) => {
  socket.on("newUser", (username: string) => {
    console.log("new user", username);
    addNewUser(username, socket.id);
    socket.to(socket.id).emit("hello");
  });

  socket.on(
    "notification",
    async (
      senderName: string,
      recieverName: string,
      notificationType: NotificationTypeNames,
    ) => {
      const notification = await prisma.notificationType.findUnique({
        where: {
          name: notificationType,
        },
      });
      console.log(senderName, recieverName, notificationType);
      let message = "";
      if (notification) {
        message = notification.message;
      }

      if (senderName !== recieverName) {
        const reciever = getUser(recieverName);
        if (reciever) {
          socket
            .to(reciever.socketId)
            .emit("notification", senderName, message);
        }
      }
    },
  );

  socket.on("disconnect", () => {
    deleteUser(socket.id);
    console.log("user disconnected");
  });
});

export default io;
