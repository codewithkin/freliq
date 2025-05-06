"use client";

import { useEffect, useRef } from "react";

export default function VideoPlayer({
  stream,
  muted = false,
}: {
  stream: MediaStream;
  muted?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      className="w-full h-full rounded-lg bg-black"
      autoPlay
      playsInline
      muted={muted}
    />
  );
}
