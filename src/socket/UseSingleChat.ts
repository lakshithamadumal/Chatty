import { useEffect, useState } from "react";
import { Chat, User, WSResponse } from "./chat";
import { useWebSocket } from "./WebSocketProvider";

export function useSingleChat(friendId: number) {
  const { socket, sendMessage, userId } = useWebSocket();
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

      // Support both legacy and current response types for friend data
      if (
        response.type === "get_friend_data" ||
        response.type === "friend_data"
      ) {
        console.log(response.payload);
        setFriend(response.payload as User);
      }

      if (response.type === "new_message") {
        const payload = response.payload as Chat;
        // Accept only messages in this conversation
        if (
          payload.to.id === friendId ||
          payload.from.id === friendId
        ) {
          setMessage((prev) => [...prev, payload]);
        }
      }
    };

    socket.addEventListener("message", onMessage);

    return () => {
      socket.removeEventListener("message", onMessage);
    };
  }, [socket, friendId]);

  const sendToFriend = (content: string) => {
    if (!content.trim()) return;
    // Notify server (UI will update from server echo)
    sendMessage({ type: "send_message", toUserId: friendId, message: content });
  };

  return { messages: messages, friend: friend, sendToFriend };
}
