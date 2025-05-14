import DashboardShell from "../dashboard/components/DashboardShell";

export const metadata = {
  title: "Upgrade Plan - Freliq",
  description:
    "Upgrade your plan to unlock more features and support on Freliq.",
};

export default function UpgradeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell hideHeader={true}>{children}</DashboardShell>;
}
