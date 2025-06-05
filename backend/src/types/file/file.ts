import { CollaboratorPayload } from "./collaborator";

export interface File {
   _id: string;
   name: string;
   folderId: string;
   creatorId: string;
   description: string;
   collaborators: CollaboratorPayload[] | CollaboratorPayload | null;
   isLocked: boolean;
   createdAt: string;
   updatedAt: string;
}

export interface FileCreationPayload {
   fileName: string;
   folderId?: string;
   description?: string;
}

export declare type FileUpdatingPayload = {
   fileName?: string;
   description?: string;
};
