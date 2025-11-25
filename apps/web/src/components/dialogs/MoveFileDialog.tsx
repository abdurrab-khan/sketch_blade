import React, { useMemo, useState, useTransition } from "react";

import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
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

import { ApiResponse } from "@/types/index.ts";

import { debounce } from "lodash";
import { cn } from "@/lib/utils.ts";
import { Loader2 } from "lucide-react";
import useMutate from "@/hooks/useMutate.ts";
import { FolderDetails } from "@/types/file.ts";
import useApiClient from "@/hooks/useApiClient.ts";
import { getFormattedTime } from "@/utils/AppUtils.ts";

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
  const [inputSearch, setInputSearch] = useState<string>("");
  const [selectedFolder, setSelectedFolder] = useState<string>(existingFolderId || "");
  const [listFolders, setListFolders] = useState<FolderDetails[]>([]);

  const apiClient = useApiClient();
  const [isPending, startTransition] = useTransition();

  const handleClickToFolder = (folderId: string) => {
    setSelectedFolder((prev) => (prev === folderId ? "" : folderId));
  };

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
      uri: `/folder/file/${_id}`,
      data: { folderId: selectedFolder },
    });
  };

  const searchFolders = useMemo(
    () =>
      debounce((searchQuery: string) => {
        startTransition(async () => {
          try {
            const folders = await apiClient.get<ApiResponse<FolderDetails[]>>(
              `/folder/search?name=${encodeURIComponent(searchQuery)}`,
            );

            startTransition(() => {
              if (folders.data?.data) {
                const data = folders.data.data;
                setListFolders(data);
              }
            });
          } catch (err) {
            console.error("Error occurred during finding folders: ", err);
          }
        });
      }, 500),
    [apiClient],
  );

  const handleSearchFolder = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearch(e.target.value);
    searchFolders(e.target.value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Move Folder</DialogTitle>
          <DialogDescription>Move the folder to another location</DialogDescription>
        </DialogHeader>
        <div>
          <div>
            <Label>Search Folder</Label>
            <Input
              className={cn(
                "rounded-none border-0 border-b bg-transparent! shadow-none ring-0 outline-none focus:border-0 focus:border-b focus:placeholder-gray-500 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
                "placeholder:text-gray-400 dark:placeholder:text-gray-500",
              )}
              placeholder={"Search folder to move"}
              value={inputSearch}
              onChange={handleSearchFolder}
            />
          </div>

          <div className={"mt-5"}>
            <div className={"max-h-40 min-h-10 overflow-y-auto"}>
              <div className={"flex h-full flex-col flex-wrap gap-4"}>
                {isPending ? (
                  <div className={"flex-center size-full"}>
                    <Loader2 className={"h-8 w-8 animate-spin"} />
                  </div>
                ) : listFolders.length <= 0 ? (
                  <div className={"flex h-10 items-center justify-center"}>
                    <p className={"text-xs text-gray-500"}>No folder found</p>
                  </div>
                ) : (
                  <>
                    {listFolders.map(({ _id, createdAt, name }) => (
                      <div
                        key={_id}
                        id={_id}
                        className={cn(
                          "rounded-md bg-blue-500/30 p-2.5 dark:bg-blue-500/10",
                          selectedFolder && _id === selectedFolder && "bg-blue-500/60",
                        )}
                        onClick={() => handleClickToFolder(_id)}
                      >
                        <div className={"flex items-center justify-between"}>
                          <div className={"flex items-center gap-x-2"}>
                            <p className={"text-sm"}>{name}</p>
                          </div>
                          <span>
                            <p className={"text-xs text-gray-400"}>{getFormattedTime(createdAt)}</p>
                          </span>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
            <Separator className={"mt-5"} />
          </div>
        </div>
        <DialogFooter>
          <Button className={"w-full"} disabled={!selectedFolder} onClick={handleMoveIntoFolder}>
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
