import React, { useState } from "react";
import useMutate from "@/hooks/useMutate.ts";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import Movefile from "../form/Movefile";

interface MoveFileDialogProps {
  _id: string;
  isOpen: boolean;
  children?: React.ReactNode;
  existingFolderId?: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MoveFileDialog: React.FC<MoveFileDialogProps> = ({
  _id,
  isOpen,
  setIsOpen,
  children,
  existingFolderId,
}) => {
  const [selectedFolder, setSelectedFolder] = useState<string>(existingFolderId || "");

  const fileUpdateMutation = useMutate({
    options: { queryKey: ["getFiles"] },
    isShowToast: true,
    finallyFn: () => setIsOpen(false),
  });

  const handleMoveIntoFolder = () => {
    if (!selectedFolder) return;

    if (existingFolderId === selectedFolder) {
      setIsOpen(false);
      return;
    }

    fileUpdateMutation.mutate({
      method: "post",
      uri: `/file/move/${_id}/${selectedFolder}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="dark:text-primary-text-dark text-primary-text-light text-2xl">
            {existingFolderId ? "Change File Location" : "Move File to Folder"}
          </DialogTitle>
          <DialogDescription>Move the folder to another location</DialogDescription>
        </DialogHeader>
        <div>
          <div className={"style-scrollbar max-h-60 min-h-10 overflow-y-auto"}>
            <Movefile selectedFolder={selectedFolder} setSelectedFolder={setSelectedFolder} />
          </div>
          <Separator className="mt-2" />
        </div>
        <DialogFooter>
          <Button
            variant={"primary"}
            className={"w-full"}
            disabled={
              !selectedFolder || fileUpdateMutation.isPending || selectedFolder === existingFolderId
            }
            onClick={handleMoveIntoFolder}
          >
            {fileUpdateMutation.isPending ? (
              <>
                Moving... <Loader2 className={"h-8 w-8 animate-spin"} />
              </>
            ) : (
              "Move"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoveFileDialog;
