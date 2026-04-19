import React from "react";
import { Loader2, Trash2 } from "lucide-react";
import useMutate from "@/hooks/useMutate";
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

interface DeleteFolderProps {
  id: string;
  isOpen: boolean;
  children?: React.ReactNode;
  queryKey?: string[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function DeleteFolder({
  id,
  isOpen,
  setIsOpen,
  children,
  queryKey = ["getFolders", "getTrashData"],
}: DeleteFolderProps) {
  const mutate = useMutate({
    isShowToast: true,
    options: { queryKey },
    finallyFn: () => setIsOpen(false),
  });

  const handleDelete = () => {
    if (mutate.isPending) return;

    mutate.mutate({
      method: "delete",
      uri: `/folder/${id}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-red-500 dark:text-red-400">
            Delete Folder Permanently
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This folder and all its contents will be permanently
            removed from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <div className="flex w-full items-center justify-between">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={mutate.isPending}
            >
              {mutate.isPending ? (
                <>
                  Deleting...
                  <Loader2 className="ml-1 h-4 w-4 animate-spin" />
                </>
              ) : (
                <>
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete Forever
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteFolder;
