"use client";
import ChatList from "./components/ChatList";
import Chat from "./components/Chat";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

function Messages() {
  // Fetch the user's chats
  const { data: chats, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await axios.get("/api/chats");
      return res.data.chats;
    },
  });

  // Track the selected chat
  const [chat, setChat] = useState<null | any>(null);

  return (
    <article className="w-full h-full flex md:flex-row flex-col">
      <ChatList
        selectedChat={chat}
        setChat={setChat}
        isLoading={isLoading}
        chats={chats}
      />
      <Chat chat={chat} />
    </article>
  );
}

export default Messages;
