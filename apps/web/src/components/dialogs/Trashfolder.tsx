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

interface TrashfolderProps {
  id: string;
  isOpen: boolean;
  children?: React.ReactNode;
  queryKey?: string[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Trashfolder({
  id,
  isOpen,
  children,
  setIsOpen,
  queryKey = ["getFolders", "getTrashData"],
}: TrashfolderProps) {
  const mutate = useMutate({
    isShowToast: true,
    options: { queryKey },
    finallyFn: () => setIsOpen(false),
  });

  const handleDelete = () => {
    if (mutate.isPending) return;

    mutate.mutate({
      method: "delete",
      uri: `/folder/trash/${id}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="dark:text-primary-text-dark text-2xl">Move to Trash</DialogTitle>
          <DialogDescription>
            This folder and all its contents will be moved to trash. You can restore it later.
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
                  Moving...
                  <Loader2 className="ml-1 h-4 w-4 animate-spin" />
                </>
              ) : (
                <>
                  <Trash2 className="mr-1 h-4 w-4" />
                  Move to Trash
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Trashfolder;
