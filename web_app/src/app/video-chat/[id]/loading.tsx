"use client";
import { motion } from "framer-motion";

export default function VideoMeetingLoading() {
  return (
    <div className="h-screen flex items-center justify-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        className="w-10 h-10 border-b-4 border-gray-900 rounded-full"
      ></motion.div>
    </div>
  );
}
