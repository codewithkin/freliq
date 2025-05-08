"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/generated/prisma";
import { Phone } from "lucide-react";
import { motion } from "framer-motion";

function CallingUser({ user }: { user: User }) {
  return (
    <article
      style={{
        backgroundImage: `url(${user?.image})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className="w-full flex flex-col justify-center items-center bg-slate-100 h-full rounded-lg min-h-[300px] backdrop-blur-2xl relative"
    >
      {/* Pulsing Phone Icon */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute top-6 right-6 bg-primary text-white p-3 rounded-full shadow-lg backdrop-blur-md"
      >
        <Phone className="w-5 h-5" />
      </motion.div>

      <article className="flex flex-col gap-2 items-center justify-center text-center z-10">
        <Avatar className="w-32 h-32 border-4 border-white shadow-md animate-pulse">
          <AvatarImage className="w-32 h-32" src={user?.image || ""} />
          <AvatarFallback className="w-32 h-32">
            {user?.email.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </article>
    </article>
  );
}

export default CallingUser;
