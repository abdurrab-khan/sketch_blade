import { folderColumns } from "./columns/FolderColumns.tsx";
import { DataTable } from "./Data-table.tsx";
import { useResponse } from "@/hooks/useResponse.tsx";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { FaFolderPlus } from "react-icons/fa";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import useMutate from "@/hooks/useMutate.ts";
import { FolderDetails } from "@/types/file.ts";
import { folderSchema } from "@/lib/zod/schemas.ts";
import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";


const FolderTable = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof folderSchema>>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      folderName: ""
    }
  });

  const { data, isPending } = useResponse<FolderDetails[]>({
    queryKeys: ["getFolders"],
    queryProps: { uri: "/folder" }
  });

  const folderMutation = useMutate({
    options: { queryKey: ["getFolders"] },
    isShowToast: true,
    finallyFn: () => setIsDeleteDialogOpen(false),
  });

  const handleCreateNewFolder = async (data: z.infer<typeof folderSchema>) => {
    // Handle New Folder Creation
    folderMutation.mutate(
      {
        method: "post",
        uri: "/folder",
        data
      }
    );
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
                {/* Form to create new folder */}
                <Form {...form} >
                  <form onSubmit={form.handleSubmit(handleCreateNewFolder)}>
                    <FormField
                      control={form.control}
                      name="folderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Folder Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter folder name"
                              {...field}
                              className="dark-input w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" variant={"app"} className={"w-full"}>
                        {folderMutation.isPending ? (
                          <>
                            Creating... <Loader2 className={"h-4 w-4 animate-spin"} />
                          </>
                        ) : (
                          "Create Folder"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          {
            (data?.data != undefined && data?.data.length > 0) ?
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
