"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import FlowContainer from "../components/FlowContainer";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useNewProjectData } from "@/stores/useNewProjectData";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader, Loader2 } from "lucide-react";

export default function NewProjectPage() {
  const router = useRouter();

  const [created, setCreated] = useState<boolean>(false);

  // Get the user's data
  const { data: user, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await axios.get("/api/user");

      return res.data.fullUser;
    },
  });

  const projectData = useNewProjectData((state) => state.data);

  // Function to update the id
  const setID = useNewProjectData((state) => state.setID);

  // Create project mutation
  const { mutate: createProject, isPending: creatingProject } = useMutation({
    mutationKey: ["createProject"],
    mutationFn: async () => {
      const res = await axios.post(`/api/project`, { data: projectData });

      return res.data.newProject;
    },
    onSuccess: (project: any) => {
      toast.success("Project created successfully");

      setCreated(true);

      // Add the project to the data object
      setID(project.id);
    },
    onError: (e) => {
      toast.error("Could not create project, try again later");

      console.log("Error: ", e);
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
      disabled={creatingProject || !created}
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

        {!created && (
          <Button
            disabled={creatingProject}
            onClick={() => {
              createProject();
            }}
          >
            {creatingProject && <Loader2 className="animate-spin" />}{" "}
            {creatingProject
              ? "Creating project..."
              : "Upload and create project"}
          </Button>
        )}
      </article>
    </FlowContainer>
  );
}
