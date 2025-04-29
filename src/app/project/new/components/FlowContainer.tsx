"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
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
  // Get the current path
  const path = usePathname();

  const first = "/project/new";
  const second = "/project/new/second";
  const third = "/project/new/third";

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
        <CardFooter className="flex w-full justify-between items-center">
          <Button size="lg" variant="outline">
            <ArrowLeft />
            Back
          </Button>
          <Button
            size="lg"
            variant="default"
            className="bg-gradient-to-r from-purple-600 to-sky-400 text-white"
          >
            Next
            <ArrowRight />
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}

export default FlowContainer;
