import React from "react";
import { LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import * as z from "zod";
import { Folder } from "@/types/file.ts";
import { useForm } from "react-hook-form";
import useMutate from "@/hooks/useMutate.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { folderSchema } from "@/lib/zod/schemas.ts";

interface FolderFormProps {
  _id?: string;
  isOpen: boolean;
  children?: React.ReactNode;
  folderData?: Partial<Folder>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function FolderForm({ _id, children, isOpen, setIsOpen, folderData }: FolderFormProps) {
  const form = useForm<z.infer<typeof folderSchema>>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      folderName: folderData?.name ?? "",
    },
  });
  const { control, handleSubmit } = form;

  const mutation = useMutate({
    options: { queryKey: ["getFolders"] },
    isShowToast: true,
    finallyFn: () => setIsOpen(false),
  });
  const { isPending } = mutation;

  const handleFolderSubmit = (data: z.infer<typeof folderSchema>) => {
    if (isPending) return;

    const method = _id ? "put" : "post";
    const uri = `/folder${_id ? "/" + _id : ""}`;

    mutation.mutate({ uri, method, data });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="dark:text-primary-text-dark text-2xl">
            {_id ? "Update Folder" : "Create New Folder"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(handleFolderSubmit)} className="space-y-4">
            <FormField
              control={control}
              name="folderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folder Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter folder name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                variant={"primary"}
                disabled={isPending}
                className="w-full cursor-pointer"
              >
                {_id ? "Update folder" : "Create folder"}
                {isPending && <LoaderCircle className="animate-spin" />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default FolderForm;
