import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Freelancer Dashboard | Freliq",
  description:
    "Track your projects, upload proofs, manage tasks, and stay connected with clients on Freliq.",
  keywords: [
    "freelancer dashboard",
    "project tracking",
    "client collaboration",
    "task management",
    "proof uploads",
    "Freliq",
  ],
  authors: [{ name: "Freliq", url: "https://freliq.app" }],
  creator: "Freliq Team",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/shortcut-icon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Freelancer Dashboard | Freliq",
    description:
      "A modern dashboard for freelancers to manage tasks, upload deliverables, and collaborate transparently.",
    url: "https://freliq.app/dashboard",
    siteName: "Freliq",
    images: [
      {
        url: "https://freliq.app/og-dashboard-preview.png",
        width: 1200,
        height: 630,
        alt: "Freelancer Dashboard Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Freelancer Dashboard | Freliq",
    description:
      "Work smart and transparently with clients. Powered by Freliq.",
    images: ["https://freliq.app/og-dashboard-preview.png"],
    creator: "@freliq",
  },
};

function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <section className="overflow-x-hidden">{children}</section>;
}

export default DashboardLayout;
