import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog.tsx";
import { Button } from "../ui/button.tsx";
import { Input } from "../ui/input.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileDetails } from "../../types/file.ts";

interface FileEditDialogProps {
  _id: string;
  children: React.ReactNode;
  fileData: FileDetails;
}

const formSchema = z.object({
  fileName: z
    .string()
    .min(3, "file name must be at least 3 characters long")
    .nonempty("file name is required"),
  folder: z.string().nonempty("Folder is required"),
  // collaborators: z.array(z.string()).nonempty("Collaborators is required"),
  // description: z.string().nonempty("Description is required"),
});

export function FileEditDialog({
  children,
  _id,
  fileData,
}: FileEditDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileName: fileData.name,
      folder: fileData?.folder.name,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data, _id);
  };

  return (
    <Dialog>
      <DialogTrigger className={"w-full"}>{children}</DialogTrigger>
      <DialogContent className="dark-container sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
          <DialogDescription>Edit the file name and other</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="fileName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Name</FormLabel>
                  <FormControl>
                    <Input
                      className={"dark-input"}
                      placeholder="Enter file name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant={"app"} className={"w-full"}>
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
