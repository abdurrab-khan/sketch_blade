import React, { useMemo, useState, useTransition } from "react";
import { debounce } from "lodash";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils.ts";
import { getFormattedTime } from "@/utils/AppUtils.ts";

import useMutate from "@/hooks/useMutate.ts";
import useApiClient from "@/hooks/useApiClient.ts";

import { ApiResponse } from "@/types/index.ts";
import { FolderDetails } from "@/types/file.ts";

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
import { FaFolderOpen } from "react-icons/fa6";
import useResponse from "@/hooks/useResponse";

interface FolderCardProps {
  id: string;
  name: string;
  setSelectFolderId: React.Dispatch<React.SetStateAction<string>>;
}

interface MoveFileDialogProps {
  _id: string;
  isOpen: boolean;
  children?: React.ReactNode;
  existingFolderId?: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FolderCard: React.FC<FolderCardProps> = ({ id, name, setSelectFolderId }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const folderId = e.target.id;
    setSelectFolderId(folderId);
  };

  return (
    <Label
      htmlFor={id}
      className="mx-1 cursor-pointer rounded-md bg-[#7886C7] px-4 py-3.5 text-white/95 outline-[#FF714B] first:mt-4 last:mb-2 has-checked:bg-[#1A3D64] has-checked:outline-2 has-checked:outline-offset-2"
    >
      <div className="flex justify-between">
        <span className="flex items-center gap-x-3">
          <FaFolderOpen />
          <p>{name}</p>
        </span>
        <input id={id} type="radio" name="folder" className="opacity-0" onChange={handleChange} />
      </div>
    </Label>
  );
};

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
  const [isSearchPending, startTransition] = useTransition();

  const { data, isPending, isFetching } = useResponse<FolderDetails[]>({
    queryKey: ["getFolder"],
    queryProps: {
      uri: "/folder",
    },
  });

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
            setListFolders([]);
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

  const folderData =
    listFolders.length > 0 && inputSearch.length > 0 ? listFolders : (data?.data ?? []);

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

          <div className={"max-h-56 min-h-10 overflow-y-auto"}>
            <div className={"flex h-full flex-col flex-wrap gap-4"}>
              {isFetching || isSearchPending ? (
                <div className={"flex-center size-full"}>
                  <Loader2 className={"h-8 w-8 animate-spin"} />
                </div>
              ) : folderData.length <= 0 ? (
                <div className={"flex h-10 items-center justify-center"}>
                  <p className={"text-xs text-gray-500"}>No folder found</p>
                </div>
              ) : (
                <>
                  {folderData.map(({ _id, name }) => (
                    <FolderCard
                      key={_id}
                      id={_id}
                      name={name}
                      setSelectFolderId={setSelectedFolder}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
          <Separator />
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
