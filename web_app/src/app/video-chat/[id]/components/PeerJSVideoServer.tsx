"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  MessageCircleWarning,
  RefreshCcw,
  DoorOpen,
  UserX,
} from "lucide-react";
import { MediaConnection, Peer } from "peerjs";
import { useContext, useEffect, useRef, useState } from "react";
import VideoPlayer from "./videos/LocalVideoPlayer";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { User } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import RemoteVideoPlayer from "./videos/RemoteVideoPlayer";
import { RealtimeContext } from "@/providers/RealtimeProvider";
import ParticipantsCard from "./ParticipantsCard";
import { useRemoteStream } from "@/stores/useRemoteStream";

export default function PeerJSVideoServer({ chatId }: { chatId: string }) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [sharingScreen, setSharingScreen] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);

  const connRef = useRef<MediaConnection | null>(null);
  const router = useRouter();

  const toggleVideo = () => {
    const videoTracks = stream?.getVideoTracks();
    if (!videoTracks || videoTracks.length === 0) return;

    if (videoMuted) {
      setVideoMuted(false);
      videoTracks.forEach((track) => (track.enabled = true));
    } else {
      setVideoMuted(true);
      videoTracks.forEach((track) => (track.enabled = false));
    }
  };

  // Update the shareScreen function in PeerJSVideoChat
  const shareScreen = async () => {
    try {
      if (!sharingScreen) {
        // Get screen stream
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });

        // Create a new stream combining screen video and original audio
        const newStream = new MediaStream();

        // Add original audio tracks if they exist
        const audioTracks = stream?.getAudioTracks() || [];
        audioTracks.forEach((track) => newStream.addTrack(track));

        // Add screen video track
        screenStream
          .getVideoTracks()
          .forEach((track) => newStream.addTrack(track));

        // Handle when user stops sharing via browser controls
        screenStream.getVideoTracks()[0].onended = () => {
          stopScreenShare();
        };

        // Replace tracks in the connection
        connRef.current?.peerConnection.getSenders().forEach((sender) => {
          if (sender.track?.kind === "video") {
            sender.replaceTrack(newStream.getVideoTracks()[0]);
          }
        });

        // Update local stream state
        setStream(newStream);
        setSharingScreen(true);
      } else {
        await stopScreenShare();
      }
    } catch (err) {
      setError("Failed to handle screen sharing.");
      console.error("Screen sharing error:", err);
    }
  };

  const stopScreenShare = async () => {
    try {
      // Get fresh camera stream
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Replace tracks in the connection
      connRef.current?.peerConnection.getSenders().forEach((sender) => {
        if (sender.track?.kind === "video") {
          sender.replaceTrack(mediaStream.getVideoTracks()[0]);
        }
        if (sender.track?.kind === "audio") {
          sender.replaceTrack(mediaStream.getAudioTracks()[0]);
        }
      });

      // Update local stream state
      setStream(mediaStream);
      setSharingScreen(false);
    } catch (err) {
      setError("Failed to stop screen sharing.");
      console.error("Error stopping screen sharing:", err);
    }
  };

  useEffect(() => {
    return () => {
      // Clean up streams when component unmounts
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const useRealtime = () => useContext(RealtimeContext);
  const { peer, peerId: myPeerId } = useRealtime();

  const remoteStream = useRemoteStream((s) => s.remoteStream);
  const setRemoteStream = useRemoteStream((s) => s.setRemoteStream);
  const clearRemoteStream = useRemoteStream((s) => s.clearMediaStream);

  const mute = () => {
    const audioTracks = stream?.getAudioTracks();

    if (!audioTracks || audioTracks.length === 0) return;

    if (muted) {
      setMuted(false);
      // Re-enable the audio track
      audioTracks.forEach((track) => (track.enabled = true));
    } else {
      setMuted(true);
      // Disable the audio track (mutes it)
      audioTracks.forEach((track) => (track.enabled = false));
    }
  };

  const { data: chat, isLoading: chatLoading } = useQuery({
    queryKey: ["chat", chatId],
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
      console.log("Local stream initialized");
    } catch (err) {
      console.error("Error accessing user media:", err);
      setError("Failed to access your camera or microphone.");
    }
  };

  const hangUp = () => {
    if (stream) stream.getTracks().forEach((t) => t.stop());

    clearRemoteStream();

    connRef.current?.close();
    toast.info("Call ended successfully!");
    router.push("/messages");
  };

  // Initialize local media when user, chat and peer are ready
  useEffect(() => {
    if (peer && chat && user) {
      initializeLocalStream();
    }
  }, [peer, chat, user]);

  // Update the call-related useEffect to handle both caller and callee cases
  useEffect(() => {
    if (!peer || !stream || !user || !chat) return;

    const remote = chat.users.find((u: User) => u.id !== user.id);
    if (!remote) return;

    const search = new URLSearchParams(window.location.search);
    const isCallee = !!search.get("callee");

    // Cleanup previous connection
    const cleanup = () => {
      if (connRef.current) {
        connRef.current.off("stream");
        connRef.current.off("error");
        connRef.current.peerConnection.ontrack = null;
      }
    };

    if (isCallee) {
      // Handle incoming calls (callee)
      const handleCall = (call: MediaConnection) => {
        connRef.current = call;
        call.answer(stream); // Answer with our stream

        call.on("stream", (remoteStream) => {
          setRemoteStream(remoteStream);
        });

        call.peerConnection.ontrack = (event) => {
          if (event.streams && event.streams.length > 0) {
            setRemoteStream(event.streams[0]);
          }
        };

        call.on("error", (err) => {
          console.error("Call error:", err);
          setError("Call error: " + err.message);
        });
      };

      peer.on("call", handleCall);
      return () => {
        peer.off("call", handleCall);
        cleanup();
      };
    } else {
      // Handle outgoing calls (caller)
      const call = peer.call(remote.id, stream, {
        metadata: {
          name: user.name,
          chatId: chat.id,
          image: user.image || "",
        },
      });

      connRef.current = call;

      call.on("stream", (remoteStream) => {
        setRemoteStream(remoteStream);
      });

      call.peerConnection.ontrack = (event) => {
        if (event.streams && event.streams.length > 0) {
          setRemoteStream(event.streams[0]);
        }
      };

      call.on("error", (err) => {
        console.error("Call error:", err);
        setError("Call error: " + err.message);
      });

      return () => {
        cleanup();
      };
    }
  }, [peer, stream, user, chat]);

  // Add this useEffect to handle peer cleanup
  useEffect(() => {
    return () => {
      if (connRef.current) {
        connRef.current.close();
      }
    };
  }, []);

  if (chatLoading || userLoading || !stream) {
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
        remoteStream ? "grid gap-4 md:gap-8" : ""
      }`}
    >
      {stream && user && (
        <VideoPlayer
          stream={stream}
          user={user}
          muted={muted}
          setMuted={mute}
          toggleVideo={toggleVideo}
          videoDisabled={videoMuted}
          hangUp={hangUp}
          shareScreen={shareScreen}
          sharingScreen={sharingScreen}
          setSharingScreen={setSharingScreen}
        />
      )}

      {/* {user && (
        <ParticipantsCard
          currentUser={user}
          remoteUser={remoteUser}
          peerId={myPeerId || ""}
          chatId={chat?.id}
        />
      )} */}

      {remoteStream && (
        <RemoteVideoPlayer user={remoteUser} stream={remoteStream} />
      )}
    </section>
  );
}
