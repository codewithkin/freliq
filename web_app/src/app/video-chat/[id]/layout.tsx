import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Video meeting",
};

export default function VideoMeetingLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <section>{children}</section>;
}
