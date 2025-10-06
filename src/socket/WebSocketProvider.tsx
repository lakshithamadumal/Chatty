import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface WebSocketContextValue {
  socket: WebSocket | null;
  isConnected: boolean;
  userId: number;
  sendMessage: (data: any) => void;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export const useWebSocketProvider: React.FC<{
  children: React.ReactNode;
  userId: number;
}> = ({ children, userId }) => {
  const [isConnected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(
      `wss://${process.env.EXPO_PUBLIC_WS_URL}/Chatty/chat?userId=${userId}`
    );
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected...");
      setConnected(true);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected...");
      setConnected(false);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, [userId]);

  const sendMessage = (data: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ ...data, userId }));
    }
  };

  return (
    <WebSocketContext.Provider
      value={{ socket: socketRef.current, isConnected, userId, sendMessage }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const ctx = useContext(WebSocketContext);
  if (!ctx) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return ctx;
};
