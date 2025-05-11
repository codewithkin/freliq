"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MessageCircleWarning, RefreshCcw, DoorOpen } from "lucide-react";
import { Peer } from "peerjs";
import { useEffect, useRef, useState } from "react";
import VideoPlayer from "./videos/LocalVideoPlayer";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { User } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import CallingUser from "./CallingUser";
import RemoteVideoPlayer from "./videos/RemoteVideoPlayer";
import { useRealtime } from "@/providers/RealtimeProvider";

export default function PeerJSVideoServer({ chatId }: { chatId: string }) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);
  const peerRef = useRef<Peer | null>(null);
  const router = useRouter();

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

  const remoteUser = chat?.users?.filter(
    (other: User) => other?.id !== user?.id,
  )[0];

  const initializePeer = async () => {
    try {
      const { peer } = useRealtime();

      if (!peer) return;

      peerRef.current = peer;

      console.log("My peer ID is: " + peer.id);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(mediaStream);

      call({ peer, peerId: remoteUser?.id, myMediaStream: mediaStream });

      peer.on("error", (err) => {
        setError("Connection error: " + err.message);
        toast.error("Connection error: " + err.message);
        console.error("Peer error:", err);
      });
    } catch (err) {
      setError("Failed to initialize peer connection");
      console.error("Peer init error:", err);
    }
  };

  const call = ({
    peer,
    peerId,
    myMediaStream,
  }: {
    peer: Peer;
    peerId?: string;
    myMediaStream?: MediaStream | null;
  }) => {
    if (!peerId || !myMediaStream) return;
    toast.info("Calling " + peerId);
    const call = peer.call(peerId, myMediaStream);
    call.on("stream", (remoteStream) => {
      setRemoteStream(remoteStream);
    });
  };

  const hangUp = () => {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    if (peerRef.current) peerRef.current.destroy();
    toast.info("Call ended successfully, hope it was a great one!");
    router.push("/messages");
  };

  useEffect(() => {
    if (typeof window !== "undefined" && chat && user) {
      initializePeer();
    }

    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
      if (peerRef.current) peerRef.current.destroy();
    };
  }, [chat, user]);

  if (chatLoading || userLoading) {
    return (
      <section className="w-full h-full flex flex-col items-center justify-center p-8 gap-4 min-h-screen min-w-screen">
        <Skeleton className="w-32 h-32 rounded-full bg-slate-200" />
        <h3 className="text-muted-foreground text-lg">
          Loading your call environment...
        </h3>
        <Skeleton className="w-1/2 h-6 bg-slate-200" />
        <Skeleton className="w-3/4 h-6 bg-slate-200" />
      </section>
    );
  }

  return (
    <article className="grid w-full p-4 grid-cols-1 h-full md:grid-cols-2 gap-12 md:p-12">
      {stream && user && (
        <VideoPlayer
          muted={muted}
          setMuted={setMuted}
          hangUp={hangUp}
          user={user}
          stream={stream}
        />
      )}

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
            <h2 className="text-xl font-medium">An error occurred</h2>
            <p className="text-muted-foreground text-sm text-center">{error}</p>
            <article className="mt-2 flex gap-2 items-center">
              <Button onClick={() => router.refresh()} variant="outline">
                <RefreshCcw />
                Refresh
              </Button>
              <Button
                onClick={() => router.push("/messages")}
                variant="destructive"
              >
                <DoorOpen />
                Leave Meeting
              </Button>
            </article>
          </article>
        </article>
      ) : (
        <CallingUser user={remoteUser} />
      )}
    </article>
  );
}
