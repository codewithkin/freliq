import { ReactNode } from "react";
import DashboardShell from "../dashboard/components/DashboardShell";

function SettingsLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}

export default SettingsLayout;
