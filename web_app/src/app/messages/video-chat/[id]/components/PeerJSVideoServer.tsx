"use client";

import socket from "@/lib/socket";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Peer } from "peerjs";
import { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";

export default function PeerJSVideoServer({
  chatId,
  userId,
}: {
  chatId: string;
  userId: string;
}) {
  // Track the stream
  const [stream, setStream] = useState<any>();

  // Fetch the chat and user data
  const { data, isLoading: loading } = useQuery({
    queryKey: ["chat", "user"],
    queryFn: async () => {
      const [chatRes, userRes] = await Promise.all([
        axios.get(`/api/chats/${chatId}`),
        axios.get("/api/user"),
      ]);

      return {
        chat: chatRes.data.chat,
        user: userRes.data.user,
      };
    },
  });

  const { chat, user } = data ?? {};

  useEffect(() => {
    const peer = new Peer();

    peer.on("open", (id) => {
      // Call the user
    });

    // Access media
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        setStream(stream);
      });

    // To avoid memory leaks
    return () => {
      peer.destroy();
    };
  }, []);

  return (
    <article>
      <VideoPlayer stream={stream} />
    </article>
  );
}
