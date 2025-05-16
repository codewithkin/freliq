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
import { Camera, Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { ProfileUploadButton } from "@/components/upload-button";
import { ClientUploadedFileData } from "uploadthing/types";
import { UploadButton } from "@/utils/uploadthing";

export default function OnboardingPage() {
  const [image, setImage] = useState<string | File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [occupation, setOccupation] = useState("");
  const [website, setWebsite] = useState("");
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchSession() {
      const session = await authClient.getSession();
      if (session?.user?.image) {
        setImage(session.user.image);
        setPreview(session.user.image);
      }
    }
    fetchSession();
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      setImage(file);
    }
  }

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await axios.post("/api/onboarding", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Profile updated!");
      router.push("/app");
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
    if (image && typeof image !== "string") {
      formData.append("image", image); // raw File upload
    } else if (typeof image === "string") {
      formData.append("image", image); // URL from uploadthing
    }

    mutation.mutate(formData);
  }

  return (
    <motion.div
      className="max-w-xl mx-auto py-12 px-4 flex flex-col min-h-screen"
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

      <form onSubmit={handleSubmit} className="space-y-6 p-2 sm:p-4 md:p-0">
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

          <Input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <ProfileUploadButton
            onUploadComplete={(url: any) => {
              setImage(url);

              console.log("URL: ", url);
            }}
          />
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
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://your-site.com"
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
    </motion.div>
  );
}
