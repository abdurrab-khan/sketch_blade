import { folderColumns } from "./columns/FolderColumns.tsx";
import { DataTable } from "./Data-table.tsx";
import { useResponse } from "../../hooks/useResponse.tsx";
import { Loader2 } from "lucide-react";
import { Folders } from "../../types/index.ts";
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
import { z } from "zod";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import useMutate from "../../hooks/useMutate.ts";
import { useParams } from "react-router";

const folderSchema = z.object({
  folderName: z
    .string()
    .min(3, {
      message: "Folder name must be at least 3 characters long",
    })
    .optional(),
});

const FolderTable = () => {
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const queryFn = ({ clerkId }: { clerkId: string; _id: string }): Promise<AxiosResponse> => {
    return axios.get("/api/folder", {
      headers: {
        Authorization: `Bearer ${clerkId}`,
      },
    });
  };

  const { data, isPending } = useResponse({
    queryFn: queryFn,
    queryKeys: ["getFolders"],
  });

  const mutationFun = ({ clerkId, data }: { clerkId: string; data: { folder_name: string } }) => {
    return axios.post("/api/folder", data, {
      headers: {
        Authorization: `Bearer ${clerkId}`,
      },
    });
  };

  const folderMutation = useMutate({
    mutateFn: mutationFun,
    options: { queryKey: ["getFolders"] },
    finallyFn: () => setIsDeleteDialogOpen(false),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const zodHandler = folderSchema.safeParse({
        folderName: e.currentTarget.folderName.value,
      });
      if (!zodHandler.success) {
        const { message } = zodHandler.error.errors[0];
        return toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      }
      const folderName = zodHandler.data.folderName;
      folderMutation.mutate({ folder_name: folderName });
    } catch (e) {
      toast({
        title: e,
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
                <form onSubmit={handleSubmit}>
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
          <DataTable columns={folderColumns} data={data as Folders[]} />
        </>
      )}
    </>
  );
};
export default FolderTable;
