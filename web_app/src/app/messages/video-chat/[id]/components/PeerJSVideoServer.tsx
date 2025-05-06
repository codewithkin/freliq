"use client";

import socket from "@/lib/socket";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Peer } from "peerjs";
import { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";

export const call = (peerId: string) => {
  try {
    navigator.mediaDevices.getUserMedia(
      { video: true, audio: true },
      (stream) => {
        const call = peer.call("another-peers-id", stream);
        call.on("stream", (remoteStream) => {
          // Show stream in some <video> element.
        });
      },
      (err) => {
        console.error("Failed to get local stream", err);
      },
    );
  } catch (error) {
    console.log("Failed to call " + peerId + " , please try again later");
  }
}

export default function PeerJSVideoServer({ chatId, userId }: { chatId: string, userId: string }) {
  // Track the stream
  const [stream, setStream] = useState<any>();

      // Get the chat's data (for reference)
      const { data: chat, isLoading: loading } = useQuery({
        queryKey: ["chat"],
        queryFn: async () => {
          const res = await axios.get(`/api/chats/${chatId}`);
  
          return res.data.chat;
        },
      });
  
      // Get the user's full data
      const { data: user } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
          const res = await axios.get("/api/user");
  
          return res.data.user;
        },
      });

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
  )
