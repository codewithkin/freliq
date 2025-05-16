import { UploadButton } from "@/utils/uploadthing";

interface Props {
  setImage: any;
  setPreview: any;
}

export function ProfileUploadButton({ setImage, setPreview }: Props) {
  return (
    <UploadButton
      endpoint="profileImageUploader"
      onClientUploadComplete={(res) => {
        console.log("Responseafter uploading file: ", res);
        if (res) {
          console.log("Response: ", res);

          setImage(res[0].ufsUrl);
          setPreview(res[0].ufsUrl);
        }
      }}
      onUploadError={(err) => {
        alert("Upload failed: " + err.message);
      }}
    />
  );
}
