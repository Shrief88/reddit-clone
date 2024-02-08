import { useEffect } from "react";

import { toast } from "sonner";
import { useSocket } from "@/context/Socket";
import { Bell } from "lucide-react";

export const Notification = () => {
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on("notification", (sender: string, message: string) => {
        toast.success(`${sender} ${message}`);
      });
    }

    return () => {
      socket?.off("notification");
    };
  }, [socket]);

  return (
    <div>
      <Bell className="h-5 w-5" />
    </div>
  );
};
