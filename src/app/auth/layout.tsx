import { Metadata } from "next";
import { ReactNode } from "react";

// app/auth/layout.tsx
export const metadata: Metadata = {
  title: "Freliq – Sign In",
  description:
    "Access your Freliq dashboard. Sign in to manage or track freelance project progress.",
  metadataBase: new URL("https://freliq.io"),
  openGraph: {
    title: "Freliq – Sign In",
    description: "Securely access your Freliq project workspace.",
    url: "https://freliq.io/auth",
    siteName: "Freliq",
  },
  twitter: {
    card: "summary",
    title: "Freliq – Sign In",
    description:
      "Log in to manage or view your freelance projects with clarity.",
  },
};

function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <>{children}</>;
}

export default AuthLayout;
