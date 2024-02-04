import { useCookies } from "react-cookie";
import { NavLink } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Plus, UserCircle2Icon } from "lucide-react";
import { Button } from "../../ui/button";
import UserAvatar from "@/components/UserAvatar";
import useAuth from "@/hooks/useAuth";

interface UserAccountNavProps {
  username: string;
  image: string;
}

const UserAccountNav = (props: UserAccountNavProps) => {
  const { user } = useAuth();
  const [, , removeCookie] = useCookies(["accessToken"]);
  const logout = () => {
    removeCookie("accessToken");
    window.location.href = "/login";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="overflow-visible font-semiboldbold text-md"
      >
        <Button variant="ghost" size="sm" className="px-0">
          <UserAvatar username={user?.username} image={user?.image} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="flex items-center gap-2">
          <UserAvatar username={user?.username} image={user?.image} />
          {props.username}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <NavLink to={`/u/${user?.username}`}>
          <DropdownMenuItem className="cursor-pointer">
            <UserCircle2Icon className="mr-2 h-4 w-4" />
            <p>Profile</p>
          </DropdownMenuItem>
        </NavLink>
        <NavLink to={"/post/create/r"}>
          <DropdownMenuItem className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            <p>Create Post</p>
          </DropdownMenuItem>
        </NavLink>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
