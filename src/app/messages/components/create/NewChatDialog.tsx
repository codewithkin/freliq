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
import { Plus } from "lucide-react";

function NewChatDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          Create chat <Plus />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new chat</DialogTitle>
          <DialogDescription>
            Create a new chat for a project then invite someone into the chat
          </DialogDescription>
        </DialogHeader>

        <article></article>

        <DialogFooter>
          <DialogClose>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NewChatDialog;
