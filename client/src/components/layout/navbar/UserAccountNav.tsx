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
import { LogOut, Settings, Plus } from "lucide-react";
import { Button } from "../../ui/button";
import UserAvatar from "@/components/UserAvatar";

interface UserAccountNavProps {
  username: string;
  image: string;
}

const UserAccountNav = (props: UserAccountNavProps) => {
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
        <Button variant="ghost" size="lg">
          My Account
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="flex items-center gap-2">
          <UserAvatar />
          {props.username}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <NavLink to={"/"}>
          <DropdownMenuItem className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            <p>Create Post</p>
          </DropdownMenuItem>
        </NavLink>
        <NavLink to={"/"}>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
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
