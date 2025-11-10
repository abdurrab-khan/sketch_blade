import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";

import * as z from "zod";
import { useForm } from "react-hook-form";
import useMutate from "../../hooks/useMutate.ts";
import { fileSchema } from "@/lib/zod/schemas.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { File as FileType } from "../../types/file.ts";
import AddCollaboratorInput from "../AddCollaboratorInput.tsx";

// Zod Validation Schema: for creation of file
interface FileCreateDialogProps {
  children: React.ReactNode;
  _id?: string;
  fileData?: FileType;
}

export function FileCreateDialog({ children, _id, fileData }: FileCreateDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof fileSchema>>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      fileName: fileData?.name ?? "",
      collaborators: fileData?.collaborators ?? [],
      description: fileData?.description ?? "",
    },
  });

  const mutation = useMutate({
    options: { queryKey: ["getFiles"] },
    finallyFn: () => {
      form.reset();
      setIsOpen(false);
    },
  });

  const handleNewFileCreation = (data: z.infer<typeof fileSchema>) => {
    if (_id) {
      // Handle File Updation 
      mutation.mutate({ method: "put", data, uri: `/file/${_id}` });
    } else {
      // Creating a new File
      mutation.mutate({ method: "post", data, uri: "/file" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="dark-container sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New File</DialogTitle>
          <DialogDescription>Enter file details and add collaborators.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleNewFileCreation)} className="space-y-6">
            <FormField
              control={form.control}
              name="fileName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter file name" {...field} className="dark-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AddCollaboratorInput
              setCollaborators={form.setValue}
              collaborators={form.getValues("collaborators") ?? []}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter file description"
                      {...field}
                      className="dark-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" variant={"app"} className={"w-full"}>
                {mutation.isPending ? (
                  <>
                    {fileData ? "Updating..." : "Creating..."}
                    <Loader2 className="mr-3 h-8 w-8 animate-spin" />
                  </>
                ) : !fileData ? (
                  "Create file"
                ) : (
                  "Update file"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}