"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { RocketIcon, PlayIcon } from "lucide-react";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 * i,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

export function LandingHeader() {
  return (
    <section
      className={cn(
        "relative w-full md:py-64 py-8",
        "bg-gradient-to-br from-background via-zinc-100 to-muted",
        "dark:from-[#0d0d0d] dark:via-[#1a1a1a] dark:to-[#0d0d0d]",
        "overflow-hidden min-h-screen flex flex-col justify-center items-center",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Badge */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-sm"
        >
          Now open for early access
        </motion.div>

        {/* Title */}
        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-4xl md:text-7xl sm:text-5xl font-semibold tracking-tight text-foreground"
        >
          Transparency meets productivity.
        </motion.h1>

        {/* Subheading */}
        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-2 text-lg sm:text-xl text-muted-foreground font-normal md:max-w-5xl mx-auto"
        >
          Freliq empowers freelancers and clients to work together in real time
          — with shared milestones, visual proof uploads, task tracking, and
          seamless communication built-in from day one.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-4 flex justify-center gap-4 flex-wrap"
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-primary to-violet-500 text-white hover:opacity-90"
          >
            <Link href="/sign-up" className="flex items-center gap-2">
              <RocketIcon className="w-5 h-5" />
              Get Started
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="#demo" className="flex items-center gap-2">
              <PlayIcon className="w-5 h-5" />
              View Demo
            </Link>
          </Button>
        </motion.div>

        <Image
          src="/images/platform/dashboard.jpeg"
          alt="Freliq app preview"
          width={480}
          height={480}
          className="w-full h-auto object-cover rounded-xl mt-12"
        />
      </div>
    </section>
  );
}
