import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import SocketProvider from "@/context/Socket";
import { ThemeProvider } from "@/context/Theme";

import Navbar from "./navbar/Navbar";

const Layout = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SocketProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="bg-background flex-1">
            <Outlet />
          </div>
          <Toaster />
        </div>
      </SocketProvider>
    </ThemeProvider>
  );
};

export default Layout;
