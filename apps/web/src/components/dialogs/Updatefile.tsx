import z from "zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Fileform from "../form/Fileform.tsx";
import useMutate from "@/hooks/useMutate.ts";
import useApiClient from "@/hooks/useApiClient.ts";

import { fileSchema } from "@/lib/zod/schemas.ts";

import { File } from "@/types/file.ts";
import { ApiResponse, AxiosMutateProps } from "@/types/index.ts";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog.tsx";

interface FileEditDialogProps {
  isOpen: boolean;
  fileData: File;
  children?: React.ReactNode;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function UpdateFile({ isOpen, fileData, children, setIsOpen }: FileEditDialogProps) {
  const apiClient = useApiClient();

  // Initializing form
  const form = useForm<z.infer<typeof fileSchema>>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      fileName: "",
      description: "",
    },
  });

  const { reset } = form;

  // Initializing default values for form
  useEffect(() => {
    if (isOpen && fileData) {
      reset({
        fileName: fileData.name ?? "",
        description: fileData.description ?? "",
      });
    }
  }, [reset, isOpen, fileData]);

  // API mutation for update file
  const updateFile = async ({
    uri,
    data,
    method,
  }: AxiosMutateProps<z.infer<typeof fileSchema>>): Promise<ApiResponse<File>> => {
    const fileFormData = {
      fileName: data?.fileName,
      description: data?.description,
    };

    try {
      const updateRes = await apiClient[method]<ApiResponse<File>>(uri, fileFormData);
      return updateRes.data;
    } catch (error) {
      throw new Error((error as Error)?.message ?? "An error occurred during file updation");
    } finally {
      reset();
      setIsOpen(false);
    }
  };

  const { mutate, isPending } = useMutate({
    isShowToast: true,
    customMutationFn: updateFile,
    options: {
      queryKey: ["getFiles"],
    },
  });

  const handleSubmit = (data: z.infer<typeof fileSchema>) => {
    if (isPending) return;

    const haveToUpdateFile =
      fileData?.description !== data?.description || fileData.name !== data.fileName;
    if (haveToUpdateFile) {
      mutate({
        uri: `/file/${fileData._id}`,
        data: data,
        method: "put",
      });
    } else {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="dark:text-primary-text-dark text-2xl">Update File</DialogTitle>
        </DialogHeader>
        <Fileform
          type="update"
          form={form}
          fileId={fileData._id}
          isPending={isPending}
          updateFileSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}

export default UpdateFile;
