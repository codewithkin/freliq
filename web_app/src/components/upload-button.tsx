import { UploadButton } from "@/utils/uploadthing";

interface Props {
  onUploadComplete: (url: string) => void;
}

export function ProfileUploadButton({ onUploadComplete }: Props) {
  return (
    <UploadButton
      endpoint="profileImageUploader"
      onClientUploadComplete={(res) => {
        console.log("Responseafter uploading file: ", res);
        if (res) {
          onUploadComplete(res);

          console.log("Response: ", res);
        }
      }}
      onUploadError={(err) => {
        alert("Upload failed: " + err.message);
      }}
    />
  );
}
