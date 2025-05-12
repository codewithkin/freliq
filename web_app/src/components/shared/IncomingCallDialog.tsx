"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PhoneCall, PhoneOff } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Howl } from "howler";
import { v4 as uuidv4 } from "uuid";
import { MediaConnection } from "peerjs";
import { RealtimeContext } from "@/providers/RealtimeProvider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const ring = new Howl({
  src: ["/sounds/ring.mp3"], // Make sure this file is in public/sounds
  volume: 0.6,
});

type IncomingCall = {
  call: MediaConnection & { id: string };
  metadata: {
    name?: string;
    chat?: string;
    [key: string]: any;
  };
};

export function IncomingCallDialog() {
  const { peer } = useContext(RealtimeContext);

  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!peer) return;

    const handleCall = (call: MediaConnection) => {
      const id = uuidv4();
      call.id = id;

      const metadata = call.metadata || {};

      setIncomingCall({ call, metadata });
      setIsOpen(true);
      ring.play();

      toast("Incoming call", {
        description: `From ${metadata?.name ?? "Unknown Caller"}`,
        action: {
          label: "Answer",
          onClick: () => handleAnswer(call),
        },
      });
    };

    peer.on("call", handleCall);
  }, [peer]);

  const handleAnswer = (call?: MediaConnection) => {
    const activeCall = call ?? incomingCall?.call;
    if (activeCall) {
      activeCall.answer();
      ring.stop();
      setIsOpen(false);
      setIncomingCall(null);
    }
  };

  const handleReject = () => {
    if (incomingCall) {
      incomingCall.call.close();
      ring.stop();
      setIsOpen(false);
      setIncomingCall(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogContent className="flex flex-col gap-4 max-w-sm justify-center items-center">
        <DialogHeader className="flex flex-col justify-center items-center">
          {/* User avatar */}
          <Avatar className="w-32 h-32 rounded-full bg-slate-200 text-2xl mb-2">
            <AvatarImage
              className="w-32 h-32 rounded-full bg-slate-200 text-2xl mb-2"
              src={incomingCall?.metadata?.image || ""}
            />
            <AvatarFallback className="w-32 h-32 rounded-full bg-slate-200 text-2xl mb-2">
              {incomingCall?.metadata?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <DialogTitle>{incomingCall?.metadata?.name || "Someone"}</DialogTitle>
          <p className="text-muted-foreground text-sm">Is calling you now...</p>
        </DialogHeader>
        <div className="flex gap-2 justify-end">
          <Button variant="default" size="lg" onClick={() => handleAnswer()}>
            <PhoneCall />
            Answer
          </Button>
          <Button variant="destructive" size="lg" onClick={handleReject}>
            <PhoneOff />
            Reject
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
