import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "400", "600", "800"],
});

// app/layout.tsx
export const metadata: Metadata = {
  title: "Freliq – Clear. Collaborative. Client-ready.",
  description:
    "Freliq is a transparent, real-time collaboration platform for freelancers, agencies, and their clients. Track progress, share proof, and keep everyone aligned.",
  keywords: [
    "freelancer",
    "agency",
    "project tracking",
    "client dashboard",
    "freelancer client portal",
  ],
  authors: [{ name: "Kin Leon Zinzombe", url: "https://freliq.com" }],
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: new URL("https://freliq.com"),
  openGraph: {
    title: "Freliq – Clear. Collaborative. Client-ready.",
    description:
      "Track freelance project progress in real time. Share proof, hit milestones, and delight clients.",
    url: "https://freliq.com",
    siteName: "Freliq",
    images: [
      {
        url: "https://freliq.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Freliq – Project Transparency Platform",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Freliq – Clear. Collaborative. Client-ready.",
    description:
      "Freliq is a client-ready collaboration platform for transparent freelance work.",
    images: ["https://freliq.com/og-image.png"],
    creator: "@codewithkin",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
