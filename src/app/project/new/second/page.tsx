"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import FlowContainer from "../components/FlowContainer";
import { useDropzone } from "react-dropzone";

export default function NewProjectPage() {
  const router = useRouter();

  // Get the user's data
  const { data: user, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await axios.get("/api/user");

      return res.data.fullUser;
    },
  });

  const isFreelancer = user?.type == "Freelancer";

  const onDrop = (acceptedFiles: File[]) => {
    // Handle the file upload logic here
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <FlowContainer
      title="Upload Project Image"
      description="Upload a memorable image of the project (maybe a banner, or an icon)"
    >
      <article className="space-y-6 w-full">
        <article className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <article {...getRootProps()} className="flex flex-col">
            <input {...getInputProps()} />
            <h2 className="text-md font-medium">
              Drag 'n' drop the Project Image here, or click to select files
            </h2>
          </article>
        </article>
      </article>
    </FlowContainer>
  );
}
