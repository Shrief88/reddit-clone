import useAuth from "@/hooks/useAuth";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";

interface SocketProviderProps {
  children: ReactNode;
}

const SocketContext = createContext<Socket | null>(null);

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setSocket(io(import.meta.env.VITE_SOCKET_URI));

      return () => {
        socket?.close();
      };
    }
  }, [user]);

  useEffect(() => {
    if (socket && user) {
      socket?.emit("newUser", user?.username as string);
    }
  }, [socket, user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;

export const useSocket = () => {
  return useContext(SocketContext);
};
