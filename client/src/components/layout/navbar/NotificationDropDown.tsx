import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useSocket } from "@/context/Socket";
import { useQuery } from "@tanstack/react-query";
import useToken from "@/hooks/useToken";
import { Button } from "@/components/ui/button";
import { Bell, Loader2 } from "lucide-react";
import { INotification } from "@/models/notification";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import Notification from "./Notification";
import useAuth from "@/hooks/useAuth";

const NotificationDropDown = () => {
  const socket = useSocket();
  const [notificationCounter, setNotificationCounter] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const { axiosClientAuth } = useToken();
  const { user } = useAuth();

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

  useEffect(() => {
    const unReadNotifications = user?.receivedNotifications.filter(
      (notification) => !notification.seen
    );
    setNotificationCounter(unReadNotifications?.length || 0);
  }, [user]);

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await axiosClientAuth.get("/notification");
      return data.data as INotification[];
    },
    enabled: showNotifications,
  });

  const handleShowNotifications = () => {
    setShowNotifications((prev) => !prev);
  };
  return (
    <DropdownMenu onOpenChange={handleShowNotifications}>
      <DropdownMenuTrigger
        asChild
        className="overflow-visible font-semiboldbold text-md"
      >
        <Button variant={"ghost"} size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-2  md:-top-0.5 -right-1 md:-right-0.5 rounded-full py-0.5 px-1.5 text-xs bg-destructive text-destructive-foreground flex justify-center items-center">
            {notificationCounter}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card w-[400px] p-0 dark:bg-black">
        <DropdownMenuLabel className="flex items-center gap-2">
          <h1 className="pt-2 px-2 text-lg">Notifications</h1>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="m-0" />
        <DropdownMenuGroup>
          {isLoading ? (
            <DropdownMenuItem className="h-20 flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin" />
            </DropdownMenuItem>
          ) : (
            notifications?.map((notification, index) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "p-0",
                  index !== notifications.length - 1 && "border-b border-input"
                )}
              >
                <Notification notification={notification} />
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <NavLink to={"/notifications"} className="flex justify-center w-full">
            <p className="text-blue-500 hover:underline text-md">See all</p>
          </NavLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropDown;
