import React from "react";
import useMutate from "@/hooks/useMutate";

import { Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
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

interface RecoverDialogProps {
  id: string;
  type: "file" | "folder";
  isOpen: boolean;
  children?: React.ReactNode;
  queryKey?: string[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function RecoverDialog({
  id,
  type,
  isOpen,
  children,
  setIsOpen,
  queryKey = ["getTrashData"],
}: RecoverDialogProps) {
  const mutation = useMutate({
    isShowToast: true,
    options: { queryKey: [...queryKey, type === "file" ? "getFiles" : "getFolders"] },
    finallyFn: () => setIsOpen(false),
  });
  const { isPending } = mutation;

  const handleRecover = () => {
    if (mutation.isPending) return;

    mutation.mutate({
      method: "post",
      uri: `/${type}/recover/${id}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-green-500 dark:text-green-400">
            Recover {type === "file" ? "File" : "Folder"}
          </DialogTitle>
          <DialogDescription>
            This will restore your {type} from trash and move it back to its original location.
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
              onClick={handleRecover}
              disabled={isPending}
              className="bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
            >
              {isPending ? (
                <>
                  Recovering...
                  <Loader2 className="ml-1 h-4 w-4 animate-spin" />
                </>
              ) : (
                <>
                  <RotateCcw className="mr-1 h-4 w-4" />
                  Recover
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RecoverDialog;
