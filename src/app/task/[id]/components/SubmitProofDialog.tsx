import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import React from "react";

function SubmitProofDialog() {
  return (
    <Dialog>
      <DialogTrigger>
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
      </DialogContent>
    </Dialog>
  );
}

export default SubmitProofDialog;
