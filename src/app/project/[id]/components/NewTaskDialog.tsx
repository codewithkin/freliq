import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { queryClient } from "@/providers/QueryClientProvider";

function NewTaskDialog({ projectId }: { projectId: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const { mutate: createNewTask, isPending: loading } = useMutation({
    mutationKey: ["createNewTask"],
    mutationFn: async () => {
      await axios.post("/api/task", {
        title,
        description,
        dueDate,
        projectId,
      });
    },
    onSuccess: () => {
      toast.success("Task created successfully");

      // Invalidate queries
      queryClient.invalidateQueries({queryKey: ["project", "task"]})

      // Close the dialog
      document.getElementById("close")?.click();
    },

    onError: () => {
      toast.error("Failed to create task....please try again later");
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          Add Task <Plus strokeWidth={1.3} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new task</DialogTitle>
          <DialogDescription>Add a new task to ths project</DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();

            createNewTask();
          }}
        >
          <article className="flex flex-col gap-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              name="title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g Increase text size on mobile screen..."
            />
          </article>

          <article className="flex flex-col gap-2">
            <Label htmlFor="title">Task Description</Label>

            <Textarea
              name="description"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g I have to set the text to 3xl or 5xl instead of 2xl on mobile screens in order to increase readability"
            />
          </article>

          <article className="flex flex-col gap-2">
            <Label htmlFor="dueDate">Due Date</Label>

            <Input
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              type="date"
              name="dueDate"
              id="dueDate"
            />
          </article>

          <DialogFooter>
            <DialogClose id="close">Close</DialogClose>
            <Button disabled={loading}>
              {loading && <Loader2 className="animate-spin" />}
              {loading ? "Creating Task..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default NewTaskDialog;
