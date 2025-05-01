"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);

  const { mutate, isPending } = useMutation({
    mutationKey: ["uploadProof"],
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("proof", file);

      const res = await fetch("/api/upload/proof", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      return res.json();
    },
    onSuccess: () => {
      toast.success("File uploaded successfully!");
      setFile(null);
    },
    onError: (err) => {
      toast.error("Failed to upload file.");
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (!file) return;

    mutate(file);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className="border border-dashed border-gray-300 p-6 rounded-md text-center cursor-pointer hover:border-blue-400"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop it here...</p>
        ) : file ? (
          <p>{file.name}</p>
        ) : (
          <p>Drag & drop a file, or click to select</p>
        )}
      </div>

      {file && (
        <Button onClick={handleUpload} disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload"
          )}
        </Button>
      )}
    </div>
  );
}
