import { ReactNode } from "react";
import DashboardShell from "../dashboard/components/DashboardShell";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages",
  description: "Your messages",
};

function MessagesLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <DashboardShell className="md:overflow-hidden" hideHeader={true}>
      {children}
    </DashboardShell>
  );
}

export default MessagesLayout;
