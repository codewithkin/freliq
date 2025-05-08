"use client";

import { usePathname } from "next/navigation";
import { RealtimeProvider } from "./RealtimeProvider";

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith("/auth");

  if (isAuthPage) return <>{children}</>;

  return <RealtimeProvider>{children}</RealtimeProvider>;
}
