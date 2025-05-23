"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { ArrowRight, Camera, Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { ProfileUploadButton } from "@/components/upload-button";
import { ClientUploadedFileData } from "uploadthing/types";
import { UploadButton } from "@/utils/uploadthing";
import Link from "next/link";

export default function OnboardingPage() {
  const { data } = authClient.useSession();

  const [image, setImage] = useState<string>(data?.user?.image || "");
  const [preview, setPreview] = useState<string>(data?.user?.image || "");
  const [bio, setBio] = useState("");
  const [occupation, setOccupation] = useState("");
  const [website, setWebsite] = useState("https://your-site.com");
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await axios.post("/api/onboarding", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Profile updated!");
      router.push("/dashboard");
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("bio", bio);
    formData.append("occupation", occupation);
    formData.append("website", website);
    formData.append("imageUrl", image); // URL from uploadthing

    mutation.mutate(formData);
  }

  return (
    <motion.div
      className="min-w-screen mx-auto py-12 px-4 flex flex-col justify-center items-center min-h-screen relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl font-bold mb-4 text-primary text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Welcome to Freliq!
      </motion.h1>
      <motion.p
        className="text-muted-foreground text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Let’s get your profile ready. This helps others understand who you are
        and what you do. It only takes a minute!
      </motion.p>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-2 sm:p-4 md:p-0 md:max-w-xl md:min-w-xl min-w-full"
      >
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="relative overflow-visible w-48 h-48 rounded-full border-2 border-muted flex items-center justify-center bg-muted/20">
            {preview ? (
              <Image
                src={preview}
                alt="Preview"
                width={192}
                height={192}
                className="rounded-full"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <Camera
                className="w-12 h-12 text-muted-foreground"
                strokeWidth={1.5}
              />
            )}
          </div>

          {image.length < 1 && (
            <ProfileUploadButton setImage={setImage} setPreview={setPreview} />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col gap-1"
        >
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us a bit about yourself..."
            required
            className="bg-background border-primary/30"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col gap-1"
        >
          <Label htmlFor="occupation">Occupation</Label>
          <Input
            id="occupation"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            placeholder="e.g. Freelance Developer"
            required
            className="bg-background border-primary/30"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col gap-1"
        >
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={website}
            type="url"
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://freliq.com"
            className="bg-background border-primary/30"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Button
            type="submit"
            className="w-full flex gap-2 hover:scale-[1.02] transition"
            disabled={mutation.isPending || !image}
          >
            {mutation.isPending ? "Saving..." : "Save & Continue 🚀"}
          </Button>
        </motion.div>
      </form>

      {/* Skip btn */}
      <Button className="absolute top-4 right-4" variant="default" asChild>
        <Link href="/dashboard">
          Skip
          <ArrowRight />
        </Link>
      </Button>
    </motion.div>
  );
}
