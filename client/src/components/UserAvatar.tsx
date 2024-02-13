import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatAvatarFallback } from "@/lib/utils";

interface UserAvatarProps {
  username: string | undefined;
  image: string | undefined;
  className?: string;
  textSize? : string;
}

const UserAvatar = (props: UserAvatarProps) => {
  return (
    <Avatar className={cn("h-8 w-8", props.className)}>
      <AvatarImage src={props.image} />
      <AvatarFallback className={props.textSize}>
        {formatAvatarFallback(props.username as string)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
