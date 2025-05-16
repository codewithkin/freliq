import React, { ReactNode } from "react";
import DashboardShell from "../dashboard/components/DashboardShell";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing & Plans",
  description: "Manage your subscription and payment methods",
};

function BillingLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}

export default BillingLayout;
