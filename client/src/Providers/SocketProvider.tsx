import { ReactNode, createContext, useContext } from "react";

const SocketContext = createContext<WebSocket | null>(null);

export const useSocket = (): WebSocket => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("Wrap with SocketProvider");
  }
  return context;
};

export default function SocketProvider({
  socket,
  children,
}: {
  socket: WebSocket;
  children: ReactNode;
}): JSX.Element {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
