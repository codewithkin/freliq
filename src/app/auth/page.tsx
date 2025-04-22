"use client";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

function Auth() {
  return (
    <section className="min-h-screen w-full flex flex-col justify-center items-center">
      <motion.article
        initial={{
          y: 200,
          opacity: 0,
        }}
        animate={{
          y: 1,
          opacity: 1,
        }}
        transition={{
          duration: 0.4,
        }}
      >
        <Card className="w-fit h-fit px-8 border border-green-400">
          <article className="flex flex-col justify-center items-center">
            <h2 className="text-2xl font-semibold">Welcome to Freliq</h2>
            <p className="text-muted-foreground text-sm">
              Transparency. Trust. Teamwork. Delivered daily.
            </p>
          </article>
        </Card>
      </motion.article>
    </section>
  );
}

export default Auth;
