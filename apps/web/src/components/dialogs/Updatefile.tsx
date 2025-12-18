import React, { useState } from "react";

import z from "zod";
import Fileform from "../form/File.tsx";
import useMutate from "@/hooks/useMutate.ts";
import useApiClient from "@/hooks/useApiClient.ts";

import { fileSchema } from "@/lib/zod/schemas.ts";

import { File } from "@/types/file.ts";
import { ApiResponse, AxiosMutateProps } from "@/types/index.ts";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog.tsx";
import { Collaborator } from "@/types/collaborator.ts";

export interface ICollaboratorState {
  newCollaborators: Collaborator[];
  removedCollaborators: Collaborator[];
}

interface FileEditDialogProps {
  isOpen: boolean;
  fileData: Partial<File>;
  children?: React.ReactNode;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function UpdateFile({ isOpen, fileData, children, setIsOpen }: FileEditDialogProps) {
  const [collaboratorState, setCollaboratorState] = useState<ICollaboratorState>({
    newCollaborators: [],
    removedCollaborators: [],
  });

  const apiClient = useApiClient();

  // Removing existing collaborators
  const removeCollaborator = async (fileId: string) => {
    const { removedCollaborators } = collaboratorState;

    // return -- if no fileId or no collaborators to remove
    if (!fileId || removedCollaborators.length <= 0) return;

    const removedIds = {
      collaboratorIds: removedCollaborators.map((rc) => rc._id),
    };

    try {
      await apiClient.put(`/collaborator/${fileId}`, removedIds);
    } catch (err) {
      throw new Error(
        (err as ApiResponse)?.message || "An error occurred during removing collaborators",
      );
    }
  };

  // Adding new collaborators
  const addCollaborator = async (fileId: string) => {
    const { newCollaborators } = collaboratorState;

    // return -- if no fileId or no new collaborators to add
    if (!fileId || newCollaborators.length <= 0) return;

    try {
      await apiClient.post(`/collaborator/${fileId}`, newCollaborators);
    } catch (err) {
      throw new Error(
        (err as ApiResponse)?.message || "An error occurred during adding collaborators",
      );
    }
  };

  const updateFile = async ({
    uri,
    data,
    method,
  }: AxiosMutateProps<z.infer<typeof fileSchema>>): Promise<ApiResponse<File>> => {
    const fileId = fileData?._id;
    const fileFormData = {
      fileName: data?.fileName,
      description: data?.description,
    };

    try {
      const haveToUpdateFile =
        fileData?.description !== fileFormData?.description ||
        fileData.name !== fileFormData?.fileName;

      // Only update if need's to
      if (haveToUpdateFile) {
        await apiClient[method]<ApiResponse<File>>(uri, fileFormData);
      }

      if (fileId) {
        await addCollaborator(fileId);
        await removeCollaborator(fileId);
      }

      return {
        statusCode: 200,
        success: true,
        message: "File updated successfully",
      };
    } catch (error) {
      throw new Error((error as Error)?.message ?? "An error occurred during file updation");
    } finally {
      setIsOpen(false);
      cleaningState();
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

    mutate({
      uri: `/file/${fileData._id}`,
      data: data,
      method: "put",
    });
  };

  // clean up --> collaborators state
  const cleaningState = () => {
    setCollaboratorState({
      newCollaborators: [],
      removedCollaborators: [],
    });
  };

  // clean up --> if dialog is close
  const handleOpenChange = (state: boolean) => {
    if (!state) {
      cleaningState();
    }
    setIsOpen(state);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Update File</DialogTitle>
        </DialogHeader>
        <Fileform
          type="update"
          fileData={fileData}
          isPending={isPending}
          collaboratorState={collaboratorState}
          setCollaboratorState={setCollaboratorState}
          handleFormSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}

export default UpdateFile;
