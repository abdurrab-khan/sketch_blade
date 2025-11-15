import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog.tsx";
import { Button } from "../ui/button.tsx";
import { Input } from "../ui/input.tsx";

interface FolderFormProps {
  _id?: string;
  children: React.ReactNode;
}

function FolderForm({ children, _id }: FolderFormProps) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="dark-container sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
          <DialogDescription>Edit the folder name and other</DialogDescription>
        </DialogHeader>
        <div>
          <Input />
        </div>
        <DialogFooter>
          <Button variant={"app"} className={"w-full"}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default FolderForm;
