"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CameraOff, MicOff, PhoneCall } from "lucide-react";
import { useEffect, useRef } from "react";

export default function VideoPlayer({
  stream,
  muted = true,
  user,
}: {
  stream: MediaStream;
  muted?: boolean;
  user: any;
}) {
  return (
    <div className="w-full h-full relative">
      {/* User info floating badge */}
      <Badge className="bg-white py-2 gap-2 flex items-center text-slate-600 absolute left-4 top-4">
        {/* User avatar */}
        <Avatar>
          <AvatarFallback>{user?.email?.charAt(0)}</AvatarFallback>
          <AvatarImage src={user?.image} />
        </Avatar>

        {/* User info */}
        <article className="flex flex-col">
          <h3 className="text-md font-semibold">{user?.email}</h3>
          <p className="text-muted-foreground tsxt-sm">{user?.type}</p>
        </article>
      </Badge>

      <video
        autoPlay
        muted={muted}
        playsInline
        ref={(video) => {
          if (video && stream) video.srcObject = stream;
        }}
        className="w-full rounded-lg border border-gray-200"
      />

      {/* Controls */}
      <article className="absolute bottom-5 w-full justify-center items-center flex">
        <article className="rounded-full bg-white w-fit p-4 gap-2 flex items-center justify-center shadow-lg">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="lg" variant="secondary" className="rounded-full">
                  <CameraOff />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Disable Camera</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                {/* End call */}
                <Button
                  className="rounded-full"
                  size="lg"
                  variant="destructive"
                >
                  <PhoneCall />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Hang up</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="lg" variant="secondary" className="rounded-full">
                  <MicOff />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mute Microphone</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </article>
      </article>
    </div>
  );
}
