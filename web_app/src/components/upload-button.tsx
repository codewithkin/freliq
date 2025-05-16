import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

interface Props {
  onUploadComplete: (url: string) => void;
}

export function ProfileUploadButton({ onUploadComplete }: Props) {
  return (
    <UploadButton<OurFileRouter, "profileImageUploader">
      endpoint="profileImageUploader"
      onClientUploadComplete={(res) => {
        if (res) {
          onUploadComplete("Hello");

          console.log("Response: ", res);
        }
      }}
      onUploadError={(err) => {
        alert("Upload failed: " + err.message);
      }}
      appearance={{
        button:
          "bg-primary text-white px-4 py-2 rounded shadow hover:scale-105 transition",
        container: "mt-4",
      }}
    />
  );
}
