import React, { useState } from "react";

import z from "zod";
import Fileform from "../form/File.tsx";
import useMutate from "@/hooks/useMutate.ts";
import { useToast } from "@/hooks/use-toast.ts";
import useApiClient from "@/hooks/useApiClient.ts";

import { fileSchema } from "@/lib/zod/schemas.ts";

import { File } from "@/types/file.ts";
import { ApiResponse, AxiosMutateProps } from "@/types/index.ts";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog.tsx";
import { Collaborator } from "@/types/collaborator.ts";

interface FileEditDialogProps {
  isOpen: boolean;
  fileData: Partial<File>;
  children?: React.ReactNode;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function UpdateFile({ isOpen, fileData, children, setIsOpen }: FileEditDialogProps) {
  const [removedColl, setRemovedColl] = useState<string[]>([]);
  const [newlyAddedColl, setNewlyAddedColl] = useState<string[]>([]);

  const { toast } = useToast();
  const apiClient = useApiClient();

  console.log("Removed collaborators are: ", removedColl);
  console.log("Added collaborators are: ", newlyAddedColl);

  // remove collaborators
  const removeCollaborator = async (fileId: string) => {
    // if no file or no collaborators removed -- return
    if (!fileId || removedColl.length === 0) return;

    const removedIds = {
      collaboratorIds: removedColl,
    };

    try {
      await apiClient.put(`/collaborator/${fileId}`, removedIds);
    } catch (err) {
      setTimeout(() => {
        toast({
          title: "Error",
          description: (err as Error)?.message || "An error occurred during removing collaborators",
          variant: "destructive",
        });
      }, 500);
    }
  };

  // insert new collaborators
  const addCollaborator = async (collaborators: Collaborator[], fileId: string) => {
    const collaboratorsToAdd = collaborators.filter((c) => newlyAddedColl.includes(c.email));

    console.log("Collaborator to add: ", collaboratorsToAdd);

    if (!fileId || collaboratorsToAdd.length === 0) return;

    try {
      await apiClient.post(`/collaborator/${fileId}`, collaboratorsToAdd);
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

  const updateFile = async ({
    uri,
    data,
    method,
  }: AxiosMutateProps): Promise<ApiResponse<File>> => {
    const { collaborators = [], ...fileFormData } = data as z.infer<typeof fileSchema>;

    try {
      const fileRes = await apiClient[method]<ApiResponse<File>>(uri, fileFormData);
      const fileId = fileData?._id;

      if (fileId) {
        await removeCollaborator(fileId);
        await addCollaborator(collaborators, fileId);
      }

      return fileRes.data ?? null;
    } catch (error) {
      throw new Error((error as Error)?.message ?? "An error occurred during file updation");
    } finally {
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

    mutate({
      uri: `/file/${fileData._id}`,
      data: data,
      method: "put",
    });
  };

  const handleOpenChange = (state: boolean) => {
    // clean up --> if dialog is close
    if (!state) {
      // clean up --> removedColl
      if (removedColl && removedColl.length > 0) {
        setRemovedColl([]);
      }

      // clean up --> newlyAddedColl
      if (newlyAddedColl && newlyAddedColl.length > 0) {
        setNewlyAddedColl([]);
      }
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
          removedColl={removedColl}
          newlyAddedColl={newlyAddedColl}
          handleFormSubmit={handleSubmit}
          setRemovedColl={setRemovedColl}
          setNewlyAddedColl={setNewlyAddedColl}
        />
      </DialogContent>
    </Dialog>
  );
}

export default UpdateFile;
