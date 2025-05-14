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

  const shareScreen = async () => {
    if (!sharingScreen) {
      // Step 1: Start sharing the screen
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });

        // Step 2: Get the video track from the screen stream
        const screenTrack = screenStream.getVideoTracks()[0];

        // Step 3: Replace the current video track with the screen track
        const sender = connRef.current?.peerConnection
          .getSenders()
          .find((s) => s.track?.kind === "video");

        if (sender) {
          sender.replaceTrack(screenTrack);
        }

        // Step 4: Set the stream to the screen stream
        setStream(screenStream);
        setSharingScreen(true);
      } catch (err) {
        setError("Failed to start screen sharing.");
        console.error("Error starting screen sharing:", err);
      }
    } else {
      // Step 5: Stop screen sharing and revert to camera
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        // Step 6: Revert back to the camera stream
        const cameraTrack = mediaStream.getVideoTracks()[0];
        const sender = connRef.current?.peerConnection
          .getSenders()
          .find((s) => s.track?.kind === "video");

        if (sender) {
          sender.replaceTrack(cameraTrack);
        }

        // Step 7: Set the stream back to the camera stream
        setStream(mediaStream);
        setSharingScreen(false);
      } catch (err) {
        setError("Failed to stop screen sharing.");
        console.error("Error stopping screen sharing:", err);
      }
    }
  };

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

  // Start the call when stream is ready
  useEffect(() => {
    if (!peer || !stream || !user || !chat) return;

    const remote = chat.users.find((u: User) => u.id !== user.id);
    if (!remote) return;

    // Don't call if you're the callee
    const search = new URLSearchParams(window.location.search);
    const isCallee = !!search.get("callee");

    if (isCallee) return;

    console.log("Calling remote peer", remote.id);
    const call = peer.call(remote.id, stream, {
      metadata: {
        name: user.name,
        chatId: chat.id,
        image: user.image || "",
      },
    });

    connRef.current = call;

    // When the user answers (giving us their own mediaStream)
    call.on("stream", (remoteStream) => {
      // Log for debugging
      console.log("Received remote stream");

      // Show their mediaStream (video)
      setRemoteStream(remoteStream);

      // Send our own mediaStream back
    });

    call.on("error", (err) => {
      console.error("Call error:", err);
      setError("Call error: " + err.message);
    });
  }, [peer, stream, user, chat]);

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
