import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Create a new project",
};

function NewProjectLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <>{children}</>;
}

export default NewProjectLayout;
