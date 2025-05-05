"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function PeerJSVideoServer({ chatId }: { chatId: string }) {
  // Get the chat's data (for reference)
  const { data: chat, isLoading: loading } = useQuery({
    queryKey: ["chat"],
    queryFn: async () => {
      const res = await axios.get(`/api/chats/${chatId}`);

      return res.data.chat;
    },
  });

  console.log("Chat data: ", chat);

  return (
    <article>
      <h2>PeerJS Video Server</h2>
    </article>
  );
}
