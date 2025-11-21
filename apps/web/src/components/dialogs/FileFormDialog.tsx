import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog.tsx";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { File } from "@/types/file.ts";
import useMutate from "@/hooks/useMutate.ts";
import { fileSchema } from "@/lib/zod/schemas.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import AddCollaboratorInput from "../AddCollaboratorInput.tsx";

// Zod Validation Schema: for creation of file
interface FileFormProps {
  _id?: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fileData?: Partial<File>;
  children?: React.ReactNode;
}

function FileForm({ children, isOpen, setIsOpen, _id, fileData }: FileFormProps) {
  const form = useForm<z.infer<typeof fileSchema>>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      fileName: fileData?.name ?? "",
      collaborators: fileData?.collaborators ?? [],
      description: fileData?.description ?? "",
    },
  });
  const { handleSubmit, reset, control, setValue, watch } = form;

  const mutation = useMutate({
    options: { queryKey: ["getFiles"] },
    finallyFn: () => {
      reset();
      setIsOpen(false);
    },
  });

  const handleNewFileCreation = (data: z.infer<typeof fileSchema>) => {
    if (_id) {
      mutation.mutate({ method: "put", data, uri: `/file/${_id}` });
    } else {
      mutation.mutate({ method: "post", data, uri: "/file" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">{!_id ? "Create New File" : "Update File"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(handleNewFileCreation)} className="space-y-6">
            <FormField
              control={control}
              name="fileName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter file name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AddCollaboratorInput setValue={setValue} watch={watch} />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter file description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" variant={"primary"} className={"w-full"}>
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

export default FileForm;
