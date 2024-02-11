import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatAvatarFallback } from "@/lib/utils";

interface UserAvatarProps {
  username: string | undefined;
  image: string | undefined;
}

const UserAvatar = (props: UserAvatarProps) => {
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={props.image} />
      <AvatarFallback>
        {formatAvatarFallback(props.username as string)}
      </AvatarFallback>
    </Avatar> 
  );
};

export default UserAvatar;
