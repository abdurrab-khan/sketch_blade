import { ActiveCollaborators, CollaboratorData } from "./collaborator.ts";
import { CreatorDetails } from "./user.ts";

export interface File {
  _id: string;
  name: string;
  folder?: FolderDetails;
  description: string;
  creator: CreatorDetails;
  activeCollaborator: ActiveCollaborators[];
  collaborators: CollaboratorData[];
  isLocked: boolean;
  isFavorite: boolean;
  state: "active" | "deleted";
  createdAt: string;
  updatedAt?: string;
}

export interface Folder {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface FolderDetails {
  _id: string;
  name: string;
  creator: CreatorDetails;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFile {
  name: string;
  collaborators: CollaboratorData[];
  description: string;
}
