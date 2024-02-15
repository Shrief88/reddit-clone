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

const saveNotification = async (
  senderName: string,
  recieverName: string,
  notificationTypeName: NotificationTypeNames,
  url: string,
  entityId: string,
): Promise<void> => {
  const sender = await prisma.user.findUnique({
    where: {
      username: senderName,
    },
  });

  const reciever = await prisma.user.findUnique({
    where: {
      username: recieverName,
    },
  });

  const notificationType = await prisma.notificationType.findUnique({
    where: {
      name: notificationTypeName,
    },
  });

  if (!sender || !reciever || !notificationType) {
    return;
  }

  const notification = await prisma.notification.findFirst({
    where: {
      receiverId: reciever.id,
      senderId: sender.id,
      typeId: notificationType?.id,
      entityId,
    },
  });

  if (notification) {
    await prisma.notification.update({
      where: {
        id: notification.id,
      },
      data: {
        createdAt: new Date(),
        seen: false,
      },
    });
  } else {
    await prisma.notification.create({
      data: {
        receiverId: reciever.id,
        senderId: sender.id,
        typeId: notificationType?.id,
        entityId,
        url,
      },
    });
  }
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
      url: string,
      entityId: string,
    ) => {
      const notification = await prisma.notificationType.findUnique({
        where: {
          name: notificationType,
        },
      });
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
        await saveNotification(
          senderName,
          recieverName,
          notificationType,
          url,
          entityId,
        );
      }
    },
  );

  socket.on("disconnect", () => {
    deleteUser(socket.id);
    console.log("user disconnected");
  });
});

export default server;
