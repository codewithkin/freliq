"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  MessageCircleWarning,
  RefreshCcw,
  DoorOpen,
  Clock,
  UserX,
} from "lucide-react";
import { MediaConnection, Peer } from "peerjs";
import { useContext, useEffect, useRef, useState } from "react";
import VideoPlayer from "./videos/LocalVideoPlayer";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import CallingUser from "./CallingUser";
import RemoteVideoPlayer from "./videos/RemoteVideoPlayer";
import { RealtimeContext } from "@/providers/RealtimeProvider";

export default function PeerJSVideoServer({ chatId }: { chatId: string }) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);
  const connRef = useRef<MediaConnection | null>(null);
  const router = useRouter();

  const useRealtime = () => useContext(RealtimeContext);
  const { peer } = useRealtime();

  const searchParams = useSearchParams();
  const peerId = searchParams?.get("peerId");

  const { data: chat, isLoading: chatLoading } = useQuery({
    queryKey: ["chat"],
    queryFn: async () => {
      const res = await axios.get(`/api/chats/${chatId}`);
      return res.data.chat;
    },
  });

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axios.get("/api/user");
      return res.data.fullUser;
    },
  });

  const remoteUser = chat?.users?.find((u: User) => u?.id !== user?.id);

  const initializeLocalStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      console.log("Local stream initialized", mediaStream);
    } catch (err) {
      console.error("Error getting user media:", err);
      setError("Failed to access your camera or microphone.");
    }
  };

  const hangUp = () => {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    connRef.current?.close();
    console.log("Call ended, navigating to messages");
    toast.info("Call ended successfully!");
    router.push("/messages");
  };

  useEffect(() => {
    if (!peer) {
      console.log("Peer not available yet");
      return;
    }
    console.log("Initializing local stream");
    initializeLocalStream();

    peer.on("call", (incomingCall: MediaConnection) => {
      console.log("Incoming call received", incomingCall);
      if (!stream) {
        setError("No local stream to answer call with.");
        return;
      }

      incomingCall.answer(stream);

      incomingCall.on("stream", (remoteStream) => {
        console.log("Incoming stream received", remoteStream);
        toast.info("Received incoming stream.");
        setRemoteStream(remoteStream);
      });

      incomingCall.on("error", (err) => {
        console.error("Call error:", err);
        setError("Call error: " + err.message);
      });

      connRef.current = incomingCall;
    });

    if (peerId && stream) {
      console.log("Making outgoing call to peer", peerId);
      const outgoingCall = peer.call(peerId, stream);
      connRef.current = outgoingCall;

      outgoingCall.on("stream", (remoteStream) => {
        console.log("Outgoing call stream received", remoteStream);
        toast.info("Connected to peer, receiving their stream.");
        setRemoteStream(remoteStream);
      });

      outgoingCall.on("error", (err) => {
        console.error("Outgoing call error:", err);
        setError("Call error: " + err.message);
      });
    }

    return () => {
      console.log("Cleaning up streams and connections");
      stream?.getTracks().forEach((track) => track.stop());
      connRef.current?.close();
    };
  }, [peer, peerId]);

  if (chatLoading || userLoading || !stream) {
    console.log("Loading chat or user data, or local stream not ready");
    return (
      <section className="w-full h-full flex flex-col items-center justify-center p-8 gap-4 min-h-screen">
        <Skeleton className="w-32 h-32 rounded-full bg-slate-200" />
        <h3 className="text-muted-foreground text-lg">
          Loading your call environment...
        </h3>
        <Skeleton className="w-1/2 h-6 bg-slate-200" />
        <Skeleton className="w-3/4 h-6 bg-slate-200" />
      </section>
    );
  }

  if (error) {
    console.log("An error occurred", error);
    const icon =
      error === "unavailable" ? (
        <UserX strokeWidth={1.2} size={72} className="text-red-500" />
      ) : (
        <MessageCircleWarning
          strokeWidth={1.2}
          size={72}
          className="text-red-500"
        />
      );

    const heading =
      error === "unavailable" ? "User Unavailable" : "An error occurred";
    const message =
      error === "unavailable"
        ? "The user is currently offline or not available for a call."
        : error;

    return (
      <section className="flex flex-col items-center justify-center text-center gap-4 p-6 md:p-12 w-full h-screen">
        {icon}
        <h2 className="text-xl font-medium">{heading}</h2>
        <p className="text-muted-foreground text-sm max-w-sm">{message}</p>
        <div className="mt-2 flex gap-2 items-center">
          <Button onClick={() => router.refresh()} variant="outline">
            <RefreshCcw className="mr-1" />
            Retry
          </Button>
          <Button
            onClick={() => router.push("/messages")}
            variant="destructive"
          >
            <DoorOpen className="mr-1" />
            Go Back
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`w-full h-full p-4 md:p-8 ${
        remoteStream ? "grid md:grid-cols-2 gap-12" : ""
      }`}
    >
      {stream && user && (
        <VideoPlayer
          muted={muted}
          setMuted={setMuted}
          hangUp={hangUp}
          user={user}
          stream={stream}
        />
      )}

      {remoteStream && <RemoteVideoPlayer stream={remoteStream} />}
    </section>
  );
}
