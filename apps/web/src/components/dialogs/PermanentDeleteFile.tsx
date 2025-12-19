import React from "react";
import { Loader2 } from "lucide-react";
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

interface DeleteFileProps {
  id: string;
  isOpen: boolean;
  children?: React.ReactNode;
  queryKey?: string[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function FileDelete({
  id,
  isOpen,
  children,
  setIsOpen,
  queryKey = ["getFiles", "getTrashData"],
}: DeleteFileProps) {
  const mutate = useMutate({
    isShowToast: true,
    options: { queryKey },
    finallyFn: () => setIsOpen(false),
  });

  const handleDelete = () => {
    if (mutate.isPending) return;

    mutate.mutate({
      method: "delete",
      uri: `/file/${id}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <span className="text-red-500">Delete File</span>
          </DialogTitle>
          <DialogDescription>Are you sure you want to delete this file?</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4"></div>
        </div>
        <DialogFooter>
          <div className={"flex w-full items-center justify-between"}>
            <DialogClose asChild>
              <Button type="button">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleDelete} disabled={mutate.isPending}>
              {mutate.isPending ? (
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

export default FileDelete;
