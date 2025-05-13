"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PhoneCall, PhoneOff } from "lucide-react";
import { useContext, useEffect, useState, useRef } from "react";
import { Howl } from "howler";
import { v4 as uuidv4 } from "uuid";
import { MediaConnection } from "peerjs";
import { RealtimeContext } from "@/providers/RealtimeProvider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ring = new Howl({
  src: ["/sounds/ring.mp3"],
  loop: true,
  volume: 0.6,
});

type IncomingCall = {
  call: MediaConnection & { id: string };
  metadata: {
    name?: string;
    chatId?: string;
    image?: string;
    [key: string]: any;
  };
};

export function IncomingCallDialog() {
  const { peer } = useContext(RealtimeContext);
  const router = useRouter();

  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!peer) return;

    const handleCall = (call: MediaConnection) => {
      const id = uuidv4();
      call.id = id;

      const metadata = call.metadata || {};

      setIncomingCall({ call, metadata });
      setIsOpen(true);
      ring.play();

      timeoutRef.current = setTimeout(() => {
        handleReject();
      }, 30_000);
    };

    peer.on("call", handleCall);

    return () => {
      peer.off("call", handleCall);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [peer]);

  const handleAnswer = async () => {
    if (!incomingCall) return;

    // Get the user's media stream
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    incomingCall.call.answer(mediaStream);

    ring.stop();
    setIsOpen(false);
    setIncomingCall(null);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    router.push(`/video-chat/${incomingCall.metadata.chatId}?callee=true`);
  };

  const handleReject = () => {
    if (incomingCall) {
      incomingCall.call.close();
      ring.stop();
      setIsOpen(false);
      setIncomingCall(null);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogContent className="flex flex-col gap-4 max-w-sm justify-center items-center">
        <DialogHeader className="flex flex-col justify-center items-center">
          <Avatar className="w-32 h-32 rounded-full bg-slate-200 text-2xl mb-2">
            <AvatarImage
              className="w-32 h-32 rounded-full"
              src={incomingCall?.metadata?.image}
            />
            <AvatarFallback>
              {incomingCall?.metadata?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <DialogTitle>
            {incomingCall?.metadata?.name || "Someone"} is calling you
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            Incoming call — pick up or reject
          </p>
        </DialogHeader>
        <div className="flex gap-2 justify-end">
          <Button variant="default" size="lg" onClick={handleAnswer}>
            <PhoneCall className="mr-1" />
            Answer
          </Button>
          <Button variant="destructive" size="lg" onClick={handleReject}>
            <PhoneOff className="mr-1" />
            Reject
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
