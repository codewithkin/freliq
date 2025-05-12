"use client";

import { usePathname } from "next/navigation";
import { RealtimeProvider } from "./RealtimeProvider";
import { IncomingCallDialog } from "@/components/shared/IncomingCallDialog";

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith("/auth");

  if (isAuthPage) return <>{children}</>;

  return (
    <RealtimeProvider>
      {children}
      <IncomingCallDialog />
    </RealtimeProvider>
  );
}
