import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuth from "@/hooks/useAuth";
import { formatAvatarFallback } from "@/lib/utils";

const UserAvatar = () => {
  const { user } = useAuth();

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={user?.image} />
      <AvatarFallback>
        {formatAvatarFallback(user?.name as string)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
