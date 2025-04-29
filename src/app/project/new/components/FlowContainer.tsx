import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactNode } from "react";

function FlowContainer({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <section className="w-screen h-screen flex flex-col justify-center items-center bg-gradient-to-tr from-purple-600 to-sky-400 p-4">
      <Card>
        <CardContent>
          <CardHeader className="px-0 pb-8">
            <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          {children}
        </CardContent>
      </Card>
    </section>
  );
}

export default FlowContainer;
