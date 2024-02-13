import { NavLink } from "react-router-dom";

import logo from "../../../assets/logo.svg";
import MaxWidthWrapper from "../MaxWidthWrapper";
import useAuth from "@/hooks/useAuth";
import UserAccountNav from "./UserAccountNav";
import SideSheet from "../SideSheet";
import SearchBar from "@/components/layout/navbar/SearchBar";
import NotificationDropDown from "./NotificationDropDown";
import { ModeToggle } from "../mode-toggle";
import { useQuery } from "@tanstack/react-query";
import useToken from "@/hooks/useToken";

const Navbar = () => {
  const { user } = useAuth();
  const { axiosClientAuth } = useToken();

  const { data: unreadNotificationsCounter } = useQuery({
    queryKey: ["unreadNotifications"],
    queryFn: async () => {
      const res = await axiosClientAuth.get("/users/unreadedNotification");
      return res.data.number as number;
    },
    enabled: !!user,
  });

  return (
    <div className="sticky z-50 top-0 inset-x-0 h-fit py-4 bg-card">
      <header className="relative">
        <MaxWidthWrapper>
          <div className="grid grid-cols-5 md:grid-cols-3 items-center">
            <div className="col-span-3 md:col-span-2 flex justify-between gap-3">
              <NavLink to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex justify-center items-center">
                  <img src={logo} className="w-10" />
                </div>
                <p className="hidden lg:inline text-xl font-medium text-foreground">
                  Briddit
                </p>
              </NavLink>

              {user && <SearchBar />}
            </div>

            <div className="flex items-center justify-end col-span-2 md:col-span-1 gap-1">
              {user && (
                <div className="flex items-center gap-1">
                  <UserAccountNav
                    image={user?.image || ""}
                    username={user?.username || ""}
                  />
                  <NotificationDropDown notificationCounter={unreadNotificationsCounter}/>
                  <SideSheet />
                </div>
              )}

              <ModeToggle />
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default Navbar;
