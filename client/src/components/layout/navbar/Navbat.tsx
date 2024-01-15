import { NavLink } from "react-router-dom";
import MaxWidthWrapper from "../MaxWidthWrapper";

import logo from "../../../assets/logo.png";
const Navbar = () => {
  return (
    <div className="bg-background static z-50 top-0 inset-x-0 h-fit py-4">
      <header className="relative bg-background">
        <MaxWidthWrapper className="pl-5">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-background rounded-full flex justify-center items-center">
                <img src={logo} className="w-10" />
              </div>
              <p className="hidden md:inline text-xl font-medium text-foreground">
                Briddit
              </p>
            </NavLink>

            {/* TODO: <Search /> */}
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default Navbar;
