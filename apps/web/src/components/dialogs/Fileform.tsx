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
import { File } from "@/types/file.ts";
import { useForm } from "react-hook-form";
import useMutate from "@/hooks/useMutate.ts";
import { fileSchema } from "@/lib/zod/schemas.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import AddCollaboratorInput from "../AddCollaboratorInput.tsx";
import { useEffect } from "react";
import useApiClient from "@/hooks/useApiClient.ts";
import { ApiResponse, AxiosMutateProps } from "@/types/index.ts";
import { Collaborator } from "@/types/collaborator.ts";
import { useToast } from "@/hooks/use-toast.ts";

// Zod Validation Schema: for creation of file
interface FileFormProps {
  _id?: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fileData?: Partial<File>;
  children?: React.ReactNode;
}

function FileForm({ children, isOpen, setIsOpen, _id, fileData }: FileFormProps) {
  const apiClient = useApiClient();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof fileSchema>>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      fileName: fileData?.name ?? "",
      collaborators: [],
      description: fileData?.description ?? "",
    },
  });
  const { handleSubmit, reset, control, setValue, watch } = form;

  const addCollaborator = async (collaborators: Collaborator[], fileId?: string) => {
    if (!fileId) return;

    try {
      await apiClient.post(`/collaborator/${fileId}`, collaborators);
    } catch (err) {
      setTimeout(() => {
        toast({
          title: "Error",
          description: (err as Error)?.message || "An error occurred during add collaborators",
          variant: "destructive",
        });
      }, 500);
    }
  };

  const createNewFile = async ({ uri, data }: AxiosMutateProps) => {
    const { collaborators = [], ...fileData } = data as z.infer<typeof fileSchema>;

    try {
      const fileRes = await apiClient.post<ApiResponse<File>>(uri, fileData);

      // if true -- it's time to add collaborators
      if (fileRes.data?.success && collaborators?.length > 0) {
        await addCollaborator(collaborators, fileRes.data?.data?._id);
      }

      return fileRes.data ?? null;
    } catch (error) {
      throw new Error((error as Error)?.message ?? "An error occured during file creation");
    } finally {
      reset();
      setIsOpen(false);
    }
  };

  const { mutate, isPending } = useMutate({
    isShowToast: true,
    customMutationFn: createNewFile,
    options: { queryKey: ["getFiles"] },
  });

  const handleFileSubmit = (data: z.infer<typeof fileSchema>) => {
    if (isPending) return;

    // submitting the file
    mutate({
      uri: `/file`,
      data: data,
      method: "post",
    });
  };

  useEffect(() => {
    // no need to fetch collaborators -- creating new file
    if (!_id) return;

    apiClient.get<ApiResponse<Collaborator[]>>(`/collaborator/${_id}`).then((d) => {
      const res = d.data;

      if (res?.success && res?.data) {
        setValue("collaborators", res.data);
      }
    });
  }, [_id, apiClient, setValue]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">{_id ? "Update File" : "Create New File"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(handleFileSubmit)} className="space-y-4">
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
              <Button
                type="submit"
                variant={"primary"}
                disabled={isPending}
                className={"w-full cursor-pointer"}
              >
                {isPending ? (
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
