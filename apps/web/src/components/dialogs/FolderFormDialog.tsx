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
import { Folder } from "@/types/file.ts";

interface FolderFormProps {
  _id?: string;
  isOpen: boolean;
  children?: React.ReactNode;
  folderData?: Partial<Folder>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function FolderForm({ _id, children, isOpen, setIsOpen, folderData }: FolderFormProps) {
  const [folderName, setFolderName] = React.useState(folderData?.name || "");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children ? <DialogTrigger>{children}</DialogTrigger> : null}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{_id ? "Edit Folder" : "Create New Folder"}</DialogTitle>
          <DialogDescription>
            {_id ? "Edit your folder details here." : "Fill the form to create a new folder."}
          </DialogDescription>
        </DialogHeader>
        <div>
          <Input value={folderName} onChange={(e) => setFolderName(e.target.value)} />
        </div>
        <DialogFooter>
          <Button variant={"primary"} className={"w-full"}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default FolderForm;
