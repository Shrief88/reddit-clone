import { NavLink } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";

import { INotification } from "@/models/notification";
import useToken from "@/hooks/useToken";
import { formatTimeToNow } from "@/lib/utils";

interface NotificationDivProps {
  notification: INotification;
}

const NotificationDiv = ({ notification }: NotificationDivProps) => {
  const { axiosClientAuth } = useToken();

  const { mutate } = useMutation({
    mutationKey: ["markAsRead", notification.id],
    mutationFn: async () => {
      await axiosClientAuth.put(`/notification/${notification.id}`);
    },
  });

  const handleMarkAsRead = () => {
    mutate();
    notification.seen = true;
  };

  return (
    <NavLink
      to={notification.url}
      className="w-full"
      onClick={handleMarkAsRead}
    >
      <div
        className={cn(
          "flex items-center gap-2 h-16 px-2",
          !notification.seen && "bg-muted dark:bg-card"
        )}
      >
        <UserAvatar
          image={notification.sender.image}
          username={notification.sender.username}
        />
        <p className="text-sm lg:text-md">
          {notification.sender.username} {notification.type.message}
        </p>

        <p className="text-muted-foreground text-xs ml-auto text-clip">
          {formatTimeToNow(new Date(notification.createdAt))}
        </p>
      </div>
    </NavLink>
  );
};

export default NotificationDiv;
