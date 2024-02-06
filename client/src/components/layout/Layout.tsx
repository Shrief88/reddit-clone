import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import SocketProvider from "@/context/Socket";

import Navbar from "./navbar/Navbat";

const Layout = () => {
  return (
    <SocketProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Outlet />
        <Toaster />
      </div>
    </SocketProvider>
  );
};

export default Layout;
