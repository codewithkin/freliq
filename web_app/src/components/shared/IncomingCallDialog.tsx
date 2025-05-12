"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Howl, Howler } from "howler";
import { useEffect, useState } from "react";
import useIncomingCallStore from "@/stores/incomingCallStore";
import { MediaConnection } from "peerjs";

const ring = new Howl({
  src: ["../sounds/ring.mp3"],
});

export function IncomingCallDialog({}: {}) {
  // Get the incoming calls
  const incomingCalls = useIncomingCallStore((state) => state.incomingCalls);

  // Remove call function
  const removeCall = useIncomingCallStore((state) => state.removeIncomingCall);

  const [incomingCall, setCall] = useState<
    (MediaConnection & { id: string }) | null
  >(null);

  // Show the component
  useEffect(() => {
    let call: any;

    if (incomingCalls.length > 1) {
      // Open the Dialog
      document.getElementById("open")?.click();

      // Play the ring sound
      ring.play();

      call = incomingCalls[0];
    }

    // Cleanup (remove the call from the state)
    return () => {
      removeCall(call?.id);
    };
  }, [incomingCalls]);

  // Answer / reject buttons
  const answer = useIncomingCallStore((state) => state.answer);
  const reject = useIncomingCallStore((state) => state.reject);

  return (
    <Dialog>
      <DialogTrigger className="hideen" id="open">
        HI
      </DialogTrigger>
      <DialogHeader className="sr-only">
        <DialogTitle>Incoming Call</DialogTitle>
      </DialogHeader>
      <DialogContent className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm">
          You have an incoming call from an unknown number.
        </p>
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              if (incomingCall) {
                answer(incomingCall.id);
              }
            }}
          >
            Answer
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (incomingCall) {
                reject(incomingCall.id);
              }
            }}
          >
            Reject
          </Button>
        </div>
      </DialogContent>
      <DialogClose className="hideen" id="close">
        HI
      </DialogClose>
    </Dialog>
  );
}
