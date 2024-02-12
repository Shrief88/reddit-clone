import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatAvatarFallback } from "@/lib/utils";

interface UserAvatarProps {
  username: string | undefined;
  image: string | undefined;
  className?: string;
}

const UserAvatar = (props: UserAvatarProps) => {
  return (
    <Avatar className={cn("h-8 w-8", props.className)}>
      <AvatarImage src={props.image} />
      <AvatarFallback>
        {formatAvatarFallback(props.username as string)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
