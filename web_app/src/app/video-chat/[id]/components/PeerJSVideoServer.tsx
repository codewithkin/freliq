"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BadgeAlert, FileWarning, MessageCircleWarning } from "lucide-react";
import { Peer } from "peerjs";
import { useEffect, useRef, useState } from "react";
import VideoPlayer from "./videos/LocalVideoPlayer";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RemoteVideoPlayer from "./videos/RemoteVideoPlayer";
import { Skeleton } from "@/components/ui/skeleton";

export default function PeerJSVideoServer({ chatId }: { chatId: string }) {
  // My stream (my video data)
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Remote stream (stream coming from the other user)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  // Track errors (and show them if necessary)
  const [error, setError] = useState<string | null>(null);

  // Manage the peer ref
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
      const peer = new Peer();
      peerRef.current = peer;

      // Handle peer open
      peer.on("open", async (id) => {
        console.log("My peer ID is: " + id);

        try {
          // Get my media stream
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          setStream(mediaStream);

          // Handle incoming calls
          peer.on("call", (call) => {
            // Answer the call (and send my media stream to them)
            call.answer(mediaStream);

            // Handle the remote stream
            call.on("stream", (remoteStream) => {
              // Handle remote stream (e.g., set it to a video element)
              console.log("Received remote stream", remoteStream);

              // Update the remote stream
              setRemoteStream(remoteStream);
            });
          });

          // Call other users in the chat
          chat?.users.forEach((chatUser: any) => {
            if (chatUser.id !== user?.id) {
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
  }, [chat]);

  return (
    <article className="grid w-full gap-4 p-4">
      {/* Local video */}
      {stream && user && <VideoPlayer user={user} stream={stream} />}

      {/* Remote video(s) will be added here */}
      {remoteStream ? (
        <RemoteVideoPlayer stream={remoteStream} />
      ) : error ? (
        <article className="md:p-8 p-4 rounded-lg border border-2 border-slate-300 flex flex-col justify-center items-center gap-2">
          <MessageCircleWarning
            strokeWidth={1.2}
            size={72}
            className="text-red-500"
          />
          <article className="flex flex-col justify-center items-center">
            <h2 className="text-xl font-medium">An error occured</h2>

            <p className="text-muted-foreground text-sm text-center">{error}</p>
          </article>
        </article>
      ) : (
        <Skeleton className="w-full bg-slate-200 h-full rounded-lg min-h-[300px]" />
      )}
    </article>
  );
}
