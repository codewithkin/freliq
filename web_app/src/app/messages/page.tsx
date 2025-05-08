"use client";

import ChatList from "./components/ChatList";
import Chat from "./components/Chat";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

function Messages() {
  const [chat, setChat] = useState<null | any>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Fetch chats
  const { data: chats, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await axios.get("/api/chats");
      return res.data.chats;
    },
  });

  // Detect if screen is mobile
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind md breakpoint
    };

    checkScreen(); // initial check
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <article className="w-full h-full flex md:flex-row flex-col min-h-screen">
      {/* Show ChatList on desktop OR when no chat is selected (on mobile) */}
      {(!isMobile || (isMobile && !chat)) && (
        <ChatList
          selectedChat={chat}
          setChat={setChat}
          isLoading={isLoading}
          chats={chats}
        />
      )}

      {/* Show Chat on desktop OR when a chat is selected (on mobile) */}
      {(!isMobile || (isMobile && chat)) && (
        <Chat setChat={setChat} chat={chat} />
      )}
    </article>
  );
}

export default Messages;
