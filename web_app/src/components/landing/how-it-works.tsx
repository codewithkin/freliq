"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  PencilLine,
  UploadCloud,
  SmilePlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Set up a Project",
    description: "Add the work, the team, and what needs to get done.",
    icon: ClipboardList,
  },
  {
    title: "Start Building",
    description: "Work on tasks, upload proof, and share updates.",
    icon: PencilLine,
  },
  {
    title: "Keep Clients in the Loop",
    description: "They see progress, leave notes, and approve work.",
    icon: UploadCloud,
  },
  {
    title: "Finish with Confidence",
    description: "Everyone’s on the same page. No surprises.",
    icon: SmilePlus,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 * i,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export function HowItWorksTimeline() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="w-full py-24 md:py-32 bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center text-3xl sm:text-4xl md:text-5xl font-semibold"
        >
          How it works
        </motion.h2>

        {/* Desktop Timeline */}
        <div className="mt-20 hidden lg:flex justify-between items-start relative">
          <div className="absolute left-0 right-0 top-8 h-1 bg-border z-0" />
          {steps.map((step, index) => {
            const isActive = activeIndex === index;

            return (
              <motion.div
                key={index}
                custom={index + 1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative z-10 w-1/4 text-center px-4 cursor-pointer transition-all",
                  isActive && "scale-105",
                )}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-4 shadow-md transition-colors",
                      isActive
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {index + 1}
                  </div>
                  <step.icon
                    className={cn(
                      "w-6 h-6 mb-2 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                  <h3
                    className={cn(
                      "text-base font-semibold",
                      isActive && "text-primary",
                    )}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={cn(
                      "text-sm mt-1 transition-opacity duration-300",
                      isActive
                        ? "text-foreground opacity-100"
                        : "text-muted-foreground opacity-80",
                    )}
                  >
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Timeline (unchanged) */}
        <div className="lg:hidden mt-16 relative pl-6 border-l-2 border-border space-y-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              custom={index + 1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="relative group"
            >
              <div className="absolute -left-4 top-1.5 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-md">
                {index + 1}
              </div>
              <div className="bg-muted/30 dark:bg-muted/10 p-4 rounded-md border border-border ml-2">
                <div className="flex items-center gap-3 mb-1">
                  <step.icon className="w-5 h-5 text-primary" />
                  <h3 className="text-base font-semibold">{step.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
