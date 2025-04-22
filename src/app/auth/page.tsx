"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Loader2, Mail } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

function Auth() {
  const isPending = true;

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

          {/* Social media sign in */}
          <article className="flex flex-col gap-2 items-center justify-center w-full">
            <Button
              size="lg"
              className="bg-slate-900 hover:bg-slate-800 transition duration-500 w-full text-white"
            >
              <FaGithub />
              Login with Github
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className=" transition duration-500 w-full"
            >
              <FcGoogle />
              Login with Google
            </Button>
          </article>

          {/* Email link sign in */}
          <form className="flex flex-col gap-2" action="">
            <article className="flex flex-col gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="codewithkin@freliq.com"
              />
            </article>
            <Button size="lg" className="w-full">
              {isPending ? <Loader2 className="animate-spin" /> : <Mail />}
              Login with email
            </Button>
          </form>
        </Card>
      </motion.article>
    </section>
  );
}

export default Auth;
