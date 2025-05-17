"use client";

import { motion } from "framer-motion";
import {
  VideoIcon,
  UserSquare2,
  BarChart3,
  FileDown,
  CheckCircle,
  UploadCloud,
  ListChecks,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Upload Proof",
    description: "Add screenshots or files to show your work.",
    icon: UploadCloud,
    bg: "from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800",
  },
  {
    title: "Track Tasks",
    description: "Check off tasks as you finish them.",
    icon: ListChecks,
    bg: "from-green-100 to-green-200 dark:from-green-900 dark:to-green-800",
  },
  {
    title: "Video Calls",
    description: "Jump on quick calls without leaving the app.",
    icon: VideoIcon,
    bg: "from-pink-100 to-pink-200 dark:from-pink-900 dark:to-pink-800",
  },
  {
    title: "Freelancer Profile",
    description: "Your own profile page — like a smart CV.",
    icon: UserSquare2,
    bg: "from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800",
  },
  {
    title: "See Progress",
    description: "Easily track how your project is going.",
    icon: BarChart3,
    bg: "from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800",
  },
  {
    title: "Export Data",
    description: "Download your info as CSV or JSON anytime.",
    icon: FileDown,
    bg: "from-rose-100 to-rose-200 dark:from-rose-900 dark:to-rose-800",
  },
  {
    title: "Built-in Chat",
    description: "Message your team without switching apps.",
    icon: MessageSquare,
    bg: "from-teal-100 to-teal-200 dark:from-teal-900 dark:to-teal-800",
  },
  {
    title: "Approve Work",
    description: "Clients approve tasks when they’re happy.",
    icon: CheckCircle,
    bg: "from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.08 * i,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export function FeaturesSection() {
  return (
    <section className="w-full py-24 md:py-32 bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-3xl sm:text-4xl md:text-5xl font-semibold"
        >
          Tools that make work easier
        </motion.h2>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-4 text-muted-foreground max-w-xl mx-auto text-base"
        >
          Everything you need to get things done, stay on track, and keep
          everyone in the loop.
        </motion.p>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              custom={i + 1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className={cn(
                "rounded-xl p-6 text-left shadow-md transition-all hover:scale-[1.02] hover:shadow-xl bg-gradient-to-br",
                feature.bg,
              )}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-md bg-white/30 dark:bg-white/10 text-primary mb-4 backdrop-blur-sm shadow-inner">
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-snug">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
