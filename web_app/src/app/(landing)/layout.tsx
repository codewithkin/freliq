import { LandingNav } from "@/components/landing/nav";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingNav />
      <main className="pt-16">{children}</main>
    </>
  );
}
