import React, { ReactNode } from "react";
import DashboardShell from "../dashboard/components/DashboardShell";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile",
};

function MyProfileLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}

export default MyProfileLayout;
