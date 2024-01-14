import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner"

import Navbar from "./navbar/Navbat";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Outlet />
      <Toaster />
    </div>
  );
};

export default Layout;
