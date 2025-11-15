import React, { useCallback, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog.tsx";
import { Input } from "../ui/input.tsx";
import { Button } from "../ui/button.tsx";
import { Label } from "../ui/label.tsx";
import { Separator } from "../ui/separator.tsx";
import { Loader2 } from "lucide-react";
import useMutate from "../../hooks/useMutate.ts";
import { FolderDetails } from "../../types/file.ts";
import { cn } from "../../lib/utils.ts";
import { getFormattedTime } from "../../utils/AppUtils.ts";
import useApiClient from "@/hooks/useApiClient.ts";
import { ApiResponse } from "@/types/index.ts";
import { debounce } from "lodash";

interface MoveFileDialogProps {
  _id: string;
  children: React.ReactNode;
  existingFolderId?: string;
}

const MoveFileDialog: React.FC<MoveFileDialogProps> = ({ children, _id, existingFolderId }) => {
  const [inputSearch, setInputSearch] = useState<string>("");
  const [selectedFolder, setSelectedFolder] = useState<string>(existingFolderId || "");
  const [listFolders, setListFolders] = useState<FolderDetails[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  const apiClient = useApiClient();
  const [isPending, startTransition] = useTransition();

  const handleClickToFolder = (folderId: string) => {
    setSelectedFolder((prev) => (prev === folderId ? "" : folderId));
  };

  const fileUpdateMutation = useMutate({
    options: { queryKey: ["getFiles"] },
    isShowToast: true,
    finallyFn: () => setOpenDialog(false),
  });

  const handleMoveIntoFolder = () => {
    if (!selectedFolder) return;

    if (existingFolderId === selectedFolder) {
      setOpenDialog(false);
      return;
    }

    fileUpdateMutation.mutate({
      method: "post",
      uri: `/folder/file/${_id}`,
      data: { folderId: selectedFolder },
    });
  };

  const handleOpenChange = () => {
    if (fileUpdateMutation.isPending) return;
    setOpenDialog((prev) => !prev);
  };

  const debounceSearchFolder = useCallback(
    () =>
      debounce((searchQuery) => {
        startTransition(async () => {
          const folders = await apiClient.get<ApiResponse<FolderDetails[]>>(
            `/folder/${searchQuery}`,
          );

          // Set Fetched Folders
          startTransition(() => {
            const folderData = folders.data?.data;

            if (folderData != undefined && folderData.length !== 0) {
              setListFolders(folderData);
            }
          });
        });
      }, 300),
    [apiClient],
  );

  const handleSearchFolder = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    setInputSearch(inputValue);
    debounceSearchFolder(); // Performing Debounce search to search folder
  };

  return (
    <Dialog open={openDialog} onOpenChange={handleOpenChange}>
      <DialogTrigger className={"w-full"}>{children}</DialogTrigger>
      <DialogContent className="dark-container sm:max-w-md">
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
          <Button
            variant={"app"}
            className={"w-full"}
            disabled={!selectedFolder}
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
