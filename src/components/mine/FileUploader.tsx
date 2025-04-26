"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("proof", file);

    try {
      setIsUploading(true);
      const res = await fetch("/api/upload/proof", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      toast.success("File uploaded successfully!");
      setFile(null);
    } catch (err) {
      toast.error("Failed to upload file.");
    } finally {
      setIsUploading(false);
    }
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
        <Button onClick={handleUpload} disabled={isUploading}>
          {isUploading ? (
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
