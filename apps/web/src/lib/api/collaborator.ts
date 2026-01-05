import { ApiResponse } from "@/types";
import { AxiosInstance } from "axios";
import { Collaborator } from "@/types/collaborator";
import { CollaboratorZodSchema } from "../zod/schemas";
import { collaboratorBuilder } from "@/utils/collaborator";

const addCollaborators = async (
  apiClient: AxiosInstance,
  fileId: string,
  collaborators: CollaboratorZodSchema[],
) => {
  // return -- if no fileId or no new collaborators to add
  if (!fileId || collaborators.length <= 0) return;

  // preparing collaborators data to send
  const processedCollaborators = collaborators
    .filter((coll) => coll.meta.state === "new")
    .map(collaboratorBuilder);

  // Return if there is not collaborators
  if (processedCollaborators.length === 0) return;

  try {
    await apiClient.post(`/collaborator/${fileId}`, processedCollaborators);
  } catch (err) {
    throw new Error(
      (err as ApiResponse)?.message || "An error occurred during adding collaborators",
    );
  }
};

const changeCollaboratorsRole = async (
  apiClient: AxiosInstance,
  fileId: string,
  collaborators: CollaboratorZodSchema[],
) => {
  if (collaborators.length <= 0) return;

  // preparing collaborators for changing there role
  const processedCollaborators = collaborators
    .filter((coll) => coll.meta.state === "old" && coll.meta.updates.oldRole !== coll.role)
    .map((coll) => ({
      collaboratorId: coll._id,
      role: coll.role,
    }));

  // Return if there is not collaborators to change there role
  if (processedCollaborators.length === 0) return;

  try {
    await apiClient.put(`/collaborator/change-role/${fileId}`, processedCollaborators);
  } catch (err) {
    throw new Error(
      (err as ApiResponse)?.message || "An error occurred during adding collaborators",
    );
  }
};

const removeCollaborators = async (
  apiClient: AxiosInstance,
  fileId: string,
  removedCollaborators: Collaborator[],
) => {
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

export { addCollaborators, removeCollaborators, changeCollaboratorsRole };
