import * as z from "zod";

import { fileSchema } from "@/lib/zod/schemas.ts";

import useMutate from "@/hooks/useMutate.ts";
import useApiClient from "@/hooks/useApiClient.ts";

import { File } from "@/types/file.ts";
import { ApiResponse, AxiosMutateProps } from "@/types/index.ts";

import Fileform from "../form/Fileform";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Zod Validation Schema: for creation of file
interface FileFormProps {
  isOpen: boolean;
  children?: React.ReactNode;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function CreateFile({ children, isOpen, setIsOpen }: FileFormProps) {
  const apiClient = useApiClient();
  const form = useForm<z.infer<typeof fileSchema>>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      fileName: "",
      description: "",
    },
  });

  // create new file
  const createNewFile = async ({ uri, data }: AxiosMutateProps) => {
    const { ...fileData } = data as z.infer<typeof fileSchema>;

    try {
      const fileRes = await apiClient.post<ApiResponse<File>>(uri, fileData);
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
          <DialogTitle className="dark:text-primary-text-dark text-2xl">
            Create New File
          </DialogTitle>
        </DialogHeader>
        <Fileform type="create" form={form} isPending={isPending} createFileSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}

export default CreateFile;
