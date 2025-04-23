"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Loader2, Mail } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";

function Auth() {
  const [email, setEmail] = useState("");

  const { mutate: signinWithGithub, isPending: signinInWithGithub } =
    useMutation({
      mutationKey: ["signInWithGithub"],
      mutationFn: async () => {
        authClient.signIn.social({
          provider: "github",
          callbackURL: "/dashboard",
        });
      },
    });

  const { mutate: signinWithGoogle, isPending: signingInWithGoogle } =
    useMutation({
      mutationKey: ["signInWithGoogle"],
      mutationFn: async () => {
        authClient.signIn.social({
          provider: "google",
          callbackURL: "/dashboard",
        });
      },
    });

  const { mutate: signinWithEmail, isPending: signinInWithEmail } = useMutation(
    {
      mutationKey: ["signinWithEmail"],
      mutationFn: async () => {
        const { error } = await authClient.signIn.magicLink({
          email,
          callbackURL: "/dashboard",
        });

        if (error) {
          return toast.error(
            "An error occured while signing you in...please try again later",
          );
        }

        toast.success("Success ! Please check your email for a sign in link");
      },
    },
  );

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
              onClick={() => signinWithGithub()}
              disabled={
                signinInWithGithub || signingInWithGoogle || signinInWithEmail
              }
            >
              {signinInWithGithub ||
              signingInWithGoogle ||
              signinInWithEmail ? (
                <Loader2 className="animate-spin" />
              ) : (
                <FaGithub />
              )}
              {signinInWithGithub || signingInWithGoogle || signinInWithEmail
                ? "Signing you in..."
                : "Sign in with Github"}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className=" transition duration-500 w-full"
              onClick={() => signinWithGoogle()}
              disabled={
                signinInWithGithub || signingInWithGoogle || signinInWithEmail
              }
            >
              {signinInWithGithub ||
              signingInWithGoogle ||
              signinInWithEmail ? (
                <Loader2 className="animate-spin" />
              ) : (
                <FcGoogle />
              )}
              {signinInWithGithub || signingInWithGoogle || signinInWithEmail
                ? "Signing you in..."
                : "Sign in with Google"}
            </Button>
          </article>

          {/* Email link sign in */}
          <form
            className="flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              signinWithEmail();
            }}
          >
            <article className="flex flex-col gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="codewithkin@freliq.com"
              />
            </article>
            <Button
              disabled={
                signinInWithGithub || signingInWithGoogle || signinInWithEmail
              }
              size="lg"
              className="w-full"
              type="submit"
            >
              {signinInWithGithub ||
              signingInWithGoogle ||
              signinInWithEmail ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Mail />
              )}
              {signinInWithGithub || signingInWithGoogle || signinInWithEmail
                ? "Signing you in..."
                : "Sign in with email"}
            </Button>
          </form>
        </Card>
      </motion.article>
    </section>
  );
}

export default Auth;
