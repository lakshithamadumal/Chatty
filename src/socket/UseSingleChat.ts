import { useEffect, useState } from "react";
import { Chat, User, WSResponse } from "./chat";
import { useWebSocket } from "./WebSocketProvider";

export function useSingleChat(friendId: number) {
  const { socket, sendMessage } = useWebSocket();
  const [messages, setMessage] = useState<Chat[]>([]);
  const [friend, setFriend] = useState<User>();

  useEffect(() => {
    if (!socket) {
      return;
    }
    sendMessage({ type: "get_single_chat", friendId });
    sendMessage({ type: "get_friend_data", friendId });
    console.log("Requested chat & friend data for friendId:", friendId);

    const onMessage = (event: MessageEvent) => {
      const response: WSResponse = JSON.parse(event.data);
      console.log(response);

      if (response.type === "single_chat") {
        setMessage(response.payload);
      }

      if (response.type === "friend_data") {
        console.log(response.payload);
        setFriend(response.payload);
      }

      if (
        response.type === "new_message" &&
        response.payload.to.id === friendId
      ) {
        //  console.log(response.payload);
        setMessage((prev) => [response.payload, ...prev]);
      }
    };

    socket.addEventListener("message", onMessage);

    return () => {
      socket.removeEventListener("message", onMessage);
    };
  }, [socket, friendId]);
  return { messages: messages, friend: friend };
}
