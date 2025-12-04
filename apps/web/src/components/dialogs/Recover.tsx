import React from "react";
import useMutate from "@/hooks/useMutate";

import { Loader2 } from "lucide-react";
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
  queryKeys?: string[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function RecoverDialog({
  id,
  type,
  isOpen,
  children,
  setIsOpen,
  queryKeys = ["getTrashData"],
}: RecoverDialogProps) {
  const mutation = useMutate({
    isShowToast: true,
    options: { queryKeys: [...queryKeys, type === "file" ? "getFiles" : "getFolders"] },
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
      {children && <DialogTrigger>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <span className="text-red-500">Delete File</span>
          </DialogTitle>
          <DialogDescription>Are you sure you want to recover your {type}?</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4"></div>
        </div>
        <DialogFooter>
          <div className={"flex w-full items-center justify-between"}>
            <DialogClose asChild>
              <Button type="button">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={handleRecover} disabled={isPending}>
              {isPending ? (
                <>
                  Recovering...
                  <Loader2 className={"ml-1 h-6 w-6 animate-spin"} />
                </>
              ) : (
                "Recover"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RecoverDialog;
