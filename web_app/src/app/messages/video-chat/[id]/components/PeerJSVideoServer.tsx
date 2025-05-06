"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FileWarning } from "lucide-react";
import { Peer } from "peerjs";
import { useEffect, useRef, useState } from "react";
import VideoPlayer from "./VideoPlayer";
import { toast } from "sonner";

export default function PeerJSVideoServer({
  chatId,
  userId,
}: {
  chatId: string;
  userId: string;
}) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const peerRef = useRef<Peer | null>(null);

  // Get the chat's data
  const { data: chat } = useQuery({
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
      return res.data.fullUser;
    },
  });

  const initializePeer = async () => {
    try {
      // Initialize peer
      const peer = new Peer(userId);
      peerRef.current = peer;

      // Handle peer open
      peer.on("open", async (id) => {
        console.log("My peer ID is: " + id);

        try {
          // Get media stream
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          setStream(mediaStream);

          // Handle incoming calls
          peer.on("call", (call) => {
            call.answer(mediaStream);
            call.on("stream", (remoteStream) => {
              // Handle remote stream (e.g., set it to a video element)
              console.log("Received remote stream", remoteStream);
            });
          });

          // Call other users in the chat
          chat?.users.forEach((chatUser: any) => {
            if (chatUser.id !== userId) {
              const call = peer.call(chatUser.id, mediaStream);
              call.on("stream", (remoteStream) => {
                // Handle remote stream
                console.log("Received remote stream from call", remoteStream);
              });
            }
          });
        } catch (err) {
          setError("Failed to access camera/microphone");
          console.error("Media error:", err);
        }
      });

      // Handle peer errors
      peer.on("error", (err) => {
        setError("Connection error: " + err.message);

        toast.error("Connection error: " + err.message);
        console.error("Peer error:", err);
      });
    } catch (err) {
      setError("Failed to initialize peer connection");
      console.error("Peer initialization error:", err);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      initializePeer();
    }

    return () => {
      // Cleanup
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, [chat, userId]);

  return (
    <article className="grid w-full gap-4 p-4">
      {/* Local video */}
      {stream && (
        <div>
          <VideoPlayer stream={stream} />
        </div>
      )}

      {error && <p className="text-red-500 w-full">Error: {error}</p>}

      {/* Remote video(s) will be added here */}
    </article>
  );
}
