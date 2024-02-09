import { useEffect, useState } from "react";

import { toast } from "sonner";
import { useSocket } from "@/context/Socket";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Notification = () => {
  const socket = useSocket();
  const [notificationCounter, setNotificationCounter] = useState(0);

  useEffect(() => {
    if (socket) {
      socket.on("notification", (sender: string, message: string) => {
        toast.success(`${sender} ${message}`);
        setNotificationCounter((prev) => prev + 1);
      });
    }

    return () => {
      socket?.off("notification");
    };
  }, [socket]);

  return (
    <Button variant={"ghost"} size="icon" className="relative">
      <Bell className="h-5 w-5" />
      <span className="absolute -top-2  md:-top-0.5 -right-1 md:-right-0.5 rounded-full py-0.5 px-1.5 text-xs bg-destructive text-destructive-foreground flex justify-center items-center">
        {notificationCounter}
      </span>
    </Button>
  );
};
