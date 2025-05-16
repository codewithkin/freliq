import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  profileImageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("Upload complete", file);
    // Optionally, store file URL in DB here
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
