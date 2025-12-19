import * as z from "zod";

import { fileSchema } from "@/lib/zod/schemas.ts";

import useMutate from "@/hooks/useMutate.ts";
import { useToast } from "@/hooks/use-toast.ts";
import useApiClient from "@/hooks/useApiClient.ts";

import { File } from "@/types/file.ts";
import { Collaborator } from "@/types/collaborator.ts";
import { ApiResponse, AxiosMutateProps } from "@/types/index.ts";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import Fileform from "../form/File";

// Zod Validation Schema: for creation of file
interface FileFormProps {
  isOpen: boolean;
  children?: React.ReactNode;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function CreateFile({ children, isOpen, setIsOpen }: FileFormProps) {
  const { toast } = useToast();
  const apiClient = useApiClient();

  // insert new collaborators
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

  // create new file
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
      setIsOpen(false);
    }
  };

  const { mutate, isPending } = useMutate({
    isShowToast: true,
    customMutationFn: createNewFile,
    options: { queryKey: ["getFiles"] },
  });

  const handleSubmit = (data: z.infer<typeof fileSchema>) => {
    if (isPending) return;

    // submitting the file
    mutate({
      uri: `/file`,
      data: data,
      method: "post",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New File</DialogTitle>
        </DialogHeader>
        <Fileform isPending={isPending} type="create" handleFormSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}

export default CreateFile;
