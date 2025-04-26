import FileUploader from "@/components/mine/FileUploader";
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
import { FileText } from "lucide-react";

function SubmitProofDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <FileText />
          Submit Proof
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit proof of the task's completion</DialogTitle>
          <DialogDescription>
            You can upload an image, short video or file
          </DialogDescription>
        </DialogHeader>

        <FileUploader />

        <DialogFooter>
          <DialogClose>Close</DialogClose>
          <Button>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SubmitProofDialog;
