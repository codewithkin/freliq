"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Peer, { MediaConnection } from "peerjs";
import { authClient } from "@/lib/auth-client";
import { urls } from "@/lib/urls";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useRemoteStream } from "@/stores/useRemoteStream";
import { redirect } from "next/navigation";
import useSound from "use-sound";

type RealtimeContextType = {
  socket: Socket | null;
  peer: Peer | null;
};

export const RealtimeContext = createContext<RealtimeContextType>({
  socket: null,
  peer: null,
});

const answerCall = async ({
  call,
  chatId,
}: {
  call: MediaConnection;
  chatId: string;
}) => {
  try {
    // Get your own media Stream
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const setRemoteStream = useRemoteStream((state) => state.setRemoteStream);

    // Answer the call with your own media stream
    call.answer(mediaStream);

    call.on("stream", (remoteStream) => {
      setRemoteStream(remoteStream);
    });

    // Redirect to the video call page
    return redirect(`/video-chat/${chatId}`);
  } catch (e) {
    console.log("Failed to answer call: ", e);

    toast.error("Something went wrong...");
  }
};

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = authClient.useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [peer, setPeer] = useState<Peer | null>(null);

  const [play] = useSound("../sounds/ring.wav");

  useEffect(() => {
    if (!session?.user?.id) return;

    // Initialize WebSocket
    const newSocket = io(urls.backend);

    // Initialize PeerJS
    const newPeer = new Peer(session.user.id, {
      port: 443,
    });

    // Set state
    setPeer(newPeer);

    // Log your newPeer id
    console.log("My newPeer ID is: ", newPeer?.id);

    setSocket(newSocket);

    // Handle incoming calls
    newPeer?.on("call", (call: any) => {
      // Play the ring tone
      play();

      toast("Incoming call", {
        action: {
          label: "Answer",
          onClick: () => {
            play();
            answerCall({ call, chatId: call?.chatId });
          },
        },
      });

      console.log("Incoming call from: ", call.newPeer);
    });

    return () => {
      newPeer.destroy();
    };
  }, [session?.user?.id]);

  return (
    <RealtimeContext.Provider value={{ socket, peer }}>
      {children}
    </RealtimeContext.Provider>
  );
}
