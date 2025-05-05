import { ReactNode } from "react";
import DashboardShell from "../dashboard/components/DashboardShell";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages",
  description: "Your messages",
};

function MessagesLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <DashboardShell hideHeader={true}>
      {children}
    </DashboardShell>
  );
}

export default MessagesLayout;
