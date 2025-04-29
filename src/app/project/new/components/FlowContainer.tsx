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
import { Progress } from "@/components/ui/progress";
import { useNewProjectData } from "@/stores/useNewProjectData";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

function FlowContainer({
  children,
  title,
  description,
  disabled,
}: {
  children: ReactNode;
  title: string;
  description: string;
  disabled?: boolean;
}) {
  // Get the current path
  const path = usePathname();

  // router for redirects
  const router = useRouter();

  const first = "/project/new";
  const second = "/project/new/second";
  const third = "/project/new/third";
  const fourth = "/project/new/fourth";

  // Get the steps data
  const highestCompletedStep = useNewProjectData(
    (state) => state.highestCompletedStep,
  );

  // Get increment / decrement functions
  const incrementStep = useNewProjectData((state) => state.incrementStep);
  const decrementStep = useNewProjectData((state) => state.decrementStep);

  useEffect(() => {
    console.log("Highest completed step: ", highestCompletedStep);
  }, [highestCompletedStep]);

  return (
    <section className="w-screen h-screen flex flex-col justify-center items-center bg-gradient-to-tr from-purple-600 to-sky-400 p-4">
      <Card>
        <CardContent>
          <CardHeader className="px-0 pb-8 w-full">
            <article className="my-4 flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">
                Step{" "}
                {highestCompletedStep > 0
                  ? highestCompletedStep
                  : highestCompletedStep + 1}{" "}
                of 4
              </p>
              <Progress
                max={100}
                className="h-6 my-0"
                value={
                  highestCompletedStep > 0
                    ? highestCompletedStep * 25
                    : (highestCompletedStep + 1) * 25
                }
              />
            </article>

            <article>
              <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </article>
          </CardHeader>
          {children}
        </CardContent>
        <CardFooter className="flex w-full justify-between items-center">
          <Button
            disabled={highestCompletedStep === 1}
            onClick={() => {
              if (highestCompletedStep === 2) {
                decrementStep();
                return router.push(first);
              }

              if (highestCompletedStep === 3) {
                decrementStep();
                return router.push(second);
              }

              if (highestCompletedStep === 4) {
                decrementStep();
                return router.push(third);
              }
            }}
            size="lg"
            variant="outline"
          >
            <ArrowLeft />
            Back
          </Button>
          <Button
            disabled={highestCompletedStep >= 4 || disabled}
            onClick={() => {
              if (highestCompletedStep === 1) {
                incrementStep();
                return router.push(second);
              }

              if (highestCompletedStep === 2) {
                incrementStep();
                return router.push(third);
              }

              if (highestCompletedStep === 3) {
                incrementStep();
                return router.push(fourth);
              }
            }}
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
