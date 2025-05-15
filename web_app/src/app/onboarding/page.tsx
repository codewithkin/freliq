// /app/onboarding/page.tsx
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
      const session = await authClient.useSession();
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("bio", bio);
    formData.append("occupation", occupation);
    formData.append("website", website);
    if (image && typeof image !== "string") {
      formData.append("image", image);
    }

    const res = await fetch("/api/onboarding", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      toast.success("Profile updated!");
      router.push("/app");
    } else {
      toast.error("Failed to update profile");
    }
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Complete your profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <div className="relative z-2 w-48 h-48 rounded-full border-2 border-muted flex items-center justify-center overflow-hidden bg-muted/20 overflow-visible">
            {preview ? (
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover rounded-full"
              />
            ) : (
              <Camera
                strokeWidth={1.5}
                className="w-12 h-12 text-muted-foreground"
              />
            )}
            <Button
              type="button"
              size="icon"
              className="absolute bottom-4 right-4 bg-primary text-white rounded-full border shadow-lg z-10"
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us a bit about yourself"
          />
        </div>

        <div>
          <Label htmlFor="occupation">Occupation</Label>
          <Input
            id="occupation"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            placeholder="e.g. Freelance Developer"
          />
        </div>

        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://your-site.com"
          />
        </div>

        <Button type="submit" className="w-full flex gap-2">
          Save & Continue
        </Button>
      </form>
    </div>
  );
}
