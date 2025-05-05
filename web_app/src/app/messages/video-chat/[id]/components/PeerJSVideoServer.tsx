"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {Peer} from "peerjs";
import { useEffect } from "react";

export default function PeerJSVideoServer({ chatId }: { chatId: string }) {
  // Get the chat's data (for reference)
  const { data: chat, isLoading: loading } = useQuery({
    queryKey: ["chat"],
    queryFn: async () => {
      const res = await axios.get(`/api/chats/${chatId}`);

      return res.data.chat;
    },
  });

  useEffect(() => {
    // Check if navigator is available
    if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
      // Call all members of this chat
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          chat?.users.map((user: any) => {
            // Your logic for handling the stream, e.g., calling the user
            const call = 
          });
        })
        .catch((error) => {
          console.error('Error accessing media devices.', error);
        });
    } else {
      console.error('Media devices not available.');
    }
  }, [chat]);

  return (
    <article>
      <h2>PeerJS Video Server</h2>
    </article>
  );
}
