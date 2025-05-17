"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export function CallToAction() {
  return (
    <section className="w-full py-24 md:py-32 bg-primary text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
        >
          Ready to simplify your freelance workflow?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg max-w-2xl mx-auto mb-8 text-white/90"
        >
          Take control of your projects, keep clients updated in real time, and
          focus on what matters most — delivering great work.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Button
            className="text-lg px-8 py-5 bg-white text-primary hover:cursor-pointer hover:text-primary hover:bg-white font-semibold shadow-xl hover:scale-105 transition-transform"
            size="lg"
            asChild
          >
            <Link href="/auth">Get Started Free</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
