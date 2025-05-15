"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Frown } from "lucide-react"; // Changed icon
import { motion } from "framer-motion";

const NotFoundPage = () => {
  useEffect(() => {
    document.title = "404 - Page Not Found";
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }} // Smoother transition
        className="text-center space-y-4 flex flex-col justify-center items-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
            delay: 0.2,
            type: "spring", // Added spring for a smoother feel
            stiffness: 120,
            damping: 20,
          }}
          className="flex items-center justify-center w-20 h-20 bg-gray-200 rounded-full shadow-md" // Simplified styling
        >
          <Frown className="w-10 h-10 text-gray-600" />{" "}
          {/* Changed to Frown icon */}
        </motion.div>
        <h1 className="text-3xl md:text-6xl font-extrabold tracking-tight text-gray-800">
          {" "}
          {/* Simplified color */}
          404
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Sorry, we couldn't find that page.
        </p>
        <Button
          asChild
          variant="outline"
          className="bg-transparent text-blue-600 hover:bg-blue-100 hover:text-blue-700 border-blue-200 transition-colors duration-200
                     shadow-sm hover:shadow-md" // More subtle styling
        >
          <a href="/">
            <span className="font-medium">Go Back to Home</span>
          </a>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
