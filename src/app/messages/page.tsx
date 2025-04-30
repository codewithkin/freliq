"use client";
import ChatList from "./components/ChatList";
import Chat from "./components/Chat";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function Messages() {
  // Fetch the user's chats
  const { data: chats, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await axios.get("/api/chats");
      return res.data.chats;
    },
  });

  return (
    <article className="w-full h-full">
      <ChatList isLoading={isLoading} chats={chats} />
      <Chat />
    </article>
  );
}

export default Messages;
