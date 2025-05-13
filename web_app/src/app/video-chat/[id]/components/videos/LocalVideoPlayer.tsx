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
import { Camera, CameraOff, Mic, MicOff, PhoneCall } from "lucide-react";
import { useState } from "react";

export default function VideoPlayer({
  stream,
  user,
  hangUp,
  muted,
  setMuted,
}: {
  stream: MediaStream;
  user: any;
  hangUp: any;
  muted: any;
  setMuted: any;
}) {
  const [cameraOff, setCameraOff] = useState(false);

  return (
    <div className="w-full h-full relative">
      {/* User info floating badge */}
      <Badge className="bg-white py-2 gap-2 flex items-center text-slate-600 absolute left-4 top-4">
        <Avatar>
          <AvatarFallback>{user?.email?.charAt(0)}</AvatarFallback>
          <AvatarImage src={user?.image} />
        </Avatar>
        <article className="flex flex-col">
          <h3 className="text-lg font-semibold">You</h3>
        </article>
      </Badge>

      {!cameraOff ? (
        <video
          autoPlay
          muted={muted}
          playsInline
          ref={(video) => {
            if (video && stream) video.srcObject = stream;
          }}
          className="w-full h-full rounded-lg border border-gray-200"
        />
      ) : (
        <article
          style={{
            backgroundImage: `url(${user?.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className="w-full h-full min-h-[400px] md:min-h-[600px] rounded-lg border border-gray-200 bg-slate-900 flex justify-center items-center"
        >
          <video
            autoPlay
            muted={muted}
            playsInline
            ref={(video) => {
              if (video && stream) video.srcObject = stream;
            }}
            className="w-full h-full rounded-lg border border-gray-200 hidden"
          />
          {!user?.image && (
            <Avatar className="w-48 h-48">
              <AvatarFallback className="w-48 h-48">
                {user?.email?.charAt(0)}
              </AvatarFallback>
              <AvatarImage className="w-48 h-48" src={user?.image} />
            </Avatar>
          )}
        </article>
      )}

      {/* Controls */}
      <article className="absolute bottom-5 w-full justify-center items-center flex">
        <article className="rounded-full bg-transparent backdrop-blur-xl w-fit p-4 gap-2 flex items-center justify-center shadow-lg">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setCameraOff(!cameraOff)}
                  size="lg"
                  variant="secondary"
                  className="rounded-full"
                >
                  {cameraOff ? <CameraOff /> : <Camera />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{cameraOff ? "Turn on" : "Turn off"} Camera</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="rounded-full"
                  size="lg"
                  variant="destructive"
                  onClick={hangUp}
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
                <Button
                  onClick={() => setMuted(!muted)}
                  size="lg"
                  variant="secondary"
                  className="rounded-full"
                >
                  {muted ? <MicOff /> : <Mic />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{muted ? "Unmute" : "Mute"} Microphone</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </article>
      </article>
    </div>
  );
}
