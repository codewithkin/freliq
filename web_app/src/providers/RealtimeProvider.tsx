// app/providers/realtime-provider.tsx
"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { authClient } from "@/lib/auth-client";
import { urls } from "@/lib/urls";
import { io, Socket } from "socket.io-client";

type RealtimeContextType = {
  socket: Socket | null;
  peer: Peer | null;
};

const RealtimeContext = createContext<RealtimeContextType>({
  socket: null,
  peer: null,
});

export const useRealtime = () => useContext(RealtimeContext);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = authClient.useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [peer, setPeer] = useState<Peer | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    // Initialize WebSocket
    const newSocket = io(urls.backend);

    // Initialize PeerJS
    const newPeer = new Peer(session.user.id, {
      port: 443,
    });
    setPeer(newPeer);

    setSocket(newSocket);

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
