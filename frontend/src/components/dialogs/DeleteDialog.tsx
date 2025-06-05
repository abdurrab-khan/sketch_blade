import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DropdownMenuItem } from "../ui/dropdown-menu.tsx";
import React from "react";
import { Loader2 } from "lucide-react";
import {MdDelete} from "react-icons/md";

interface DeleteDialogProps {
  isOpen: boolean;
  handleDelete: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading?: boolean;
}

function DeleteDialog({
  isOpen,
  handleDelete,
  setOpen,
  isLoading,
}: DeleteDialogProps) {
  const handleClose = () => {
    if (isLoading && isLoading) return;
    setOpen((prev) => !prev);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className={"w-full"}
          onSelect={(event) => {
            event.preventDefault();
          }}
        >
          <MdDelete className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="dark-container sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <span className="text-red-500">Delete File</span>
          </DialogTitle>
          <DialogDescription className={"text-quaternary"}>
            Are you sure you want to delete this file?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4"></div>
        </div>
        <DialogFooter>
          <div className={"flex w-full items-center justify-between"}>
            <Button type="button" variant={"app"} onClick={handleClose}>
              Cancel
            </Button>
            <Button type="button" variant={"delete"} onClick={handleDelete}>
              {isLoading ? (
                <>
                  Deleting...
                  <Loader2 className={"ml-1 h-6 w-6 animate-spin"} />
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteDialog;
