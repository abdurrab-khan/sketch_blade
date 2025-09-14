import { folderColumns } from "./columns/FolderColumns.tsx";
import { DataTable } from "./Data-table.tsx";
import { useResponse } from "../../hooks/useResponse.tsx";
import { Loader2 } from "lucide-react";
import { useToast } from "../../hooks/use-toast.ts";
import { ToastAction } from "../ui/toast.tsx";
import { Button } from "../ui/button.tsx";
import { FaFolderPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import useMutate from "../../hooks/useMutate.ts";
import { FolderDetails } from "@/types/file.ts";
import { folderSchema } from "@/lib/zod/schemas.ts";

const FolderTable = () => {
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data, isPending } = useResponse<FolderDetails[]>({
    queryKeys: ["getFolders"],
    queryProps: { uri: "/folder" }
  });

  const folderMutation = useMutate({
    options: { queryKey: ["getFolders"] },
    isShowToast: true,
    finallyFn: () => setIsDeleteDialogOpen(false),
  });

  const createNewFolder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const zodHandler = folderSchema.safeParse({
        folderName: e.currentTarget.folderName.value,
      });

      if (!zodHandler.success) {
        const message = zodHandler.error.message;
        return toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      }

      folderMutation.mutate(
        {
          method: "post",
          uri: "/folder",
          data: {
            folder_name: zodHandler.data.folderName
          }
        }
      );
    } catch (e) {
      toast({
        title: e instanceof Error ? e.message : "An error occurred during folder creation.",
        variant: "destructive",
        action: (
          <ToastAction altText="Try again" onClick={() => folderMutation.mutate}>
            Try again
          </ToastAction>
        ),
      });
    }
  };

  const handleDeleteDialogOpen = () => {
    if (folderMutation.isPending) return;
    setIsDeleteDialogOpen((prev) => !prev);
  };

  return (
    <>
      {isPending ? (
        <div className={"flex-center size-full"}>
          <div>
            <Loader2 className={"h-8 w-8 animate-spin"} />
          </div>
        </div>
      ) : (
        <>
          <div className={"mb-3 w-full text-end"}>
            <Dialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant={"app"}>
                  New Folder <FaFolderPlus className={"ml-2"} />
                </Button>
              </DialogTrigger>
              <DialogContent className="dark-container sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add a new folder</DialogTitle>
                  <DialogDescription>Create a new folder to organize your files</DialogDescription>
                </DialogHeader>
                <form onSubmit={createNewFolder}>
                  <div className="grid gap-4 py-4">
                    <Label htmlFor="folderName">Folder Name</Label>
                    <Input
                      type="text"
                      id="folderName"
                      name="folderName"
                      placeholder="Enter folder name"
                      className="dark-input w-full"
                    />
                  </div>
                  <div className={"mt-4"}>
                    <Button type="submit" variant={"app"} className={"w-full"}>
                      {folderMutation.isPending ? (
                        <>
                          Creating... <Loader2 className={"h-4 w-4 animate-spin"} />
                        </>
                      ) : (
                        "Create Folder"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {
            (data?.data != undefined && data?.data.length === 0) ?
              (
                <DataTable columns={folderColumns} data={data?.data} />
              ) : (
                <div className="text-8xl">No Folder Found</div>
              )
          }
        </>
      )}
    </>
  );
};
export default FolderTable;
