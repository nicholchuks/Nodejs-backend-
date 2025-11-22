import React, { createContext, useContext, useEffect, useState } from "react";
import { io as socketIOClient } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) return;

    const socketClient = socketIOClient("http://localhost:5000", {
      auth: { token },
      transports: ["websocket"],
      autoConnect: true,
    });

    socketClient.on("connect", () => {
      console.log("🟢 Connected as:", socketClient.id);
      setConnected(true);
    });

    socketClient.on("disconnect", (reason) => {
      console.log("🔴 Disconnected:", reason);
      setConnected(false);
    });

    socketClient.on("connect_error", (err) => {
      console.error("🔴 Connection Error:", err.message);
    });

    setSocket(socketClient);

    // Cleanup on unmount
    return () => {
      socketClient.disconnect();
    };
  }, []); // Runs once

  // Function to manually reconnect with a new token
  const reconnect = () => {
    if (socket) {
      socket.disconnect();
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const newSocket = socketIOClient("http://localhost:5000", {
        auth: { token },
        transports: ["websocket"],
      });

      newSocket.on("connect", () => {
        console.log("🟢 Reconnected as:", newSocket.id);
        setConnected(true);
      });

      newSocket.on("disconnect", () => setConnected(false));
      setSocket(newSocket);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, connected, reconnect }}>
      {children}
    </SocketContext.Provider>
  );
};
