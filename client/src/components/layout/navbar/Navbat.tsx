import { NavLink } from "react-router-dom";

import logo from "../../../assets/logo.png";
import MaxWidthWrapper from "../MaxWidthWrapper";
import useAuth from "@/hooks/useAuth";
import UserAccountNav from "./UserAccountNav";
import SideSheet from "../SideSheet";
import SearchBar from "@/components/SearchBar";
import { Bell } from "lucide-react";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <div className="sticky z-50 top-0 inset-x-0 h-fit py-4 bg-background">
      <header className="relative">
        <MaxWidthWrapper>
          <div className="grid grid-cols-4 md:grid-cols-3 items-center">
            <div className="col-span-3 md:col-span-2 flex justify-between gap-3">
              <NavLink to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-background rounded-full flex justify-center items-center">
                  <img src={logo} className="w-10" />
                </div>
                <p className="hidden lg:inline text-xl font-medium text-foreground">
                  Briddit
                </p>
              </NavLink>

              {user && <SearchBar />}
            </div>

            {user && (
              <div className="flex items-center justify-end gap-2 md:gap-4">
                <UserAccountNav
                  image={user?.image || ""}
                  username={user?.name || ""}
                />
                <Bell className="h-5 w-5" />
                <SideSheet />
              </div>
            )}
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default Navbar;
