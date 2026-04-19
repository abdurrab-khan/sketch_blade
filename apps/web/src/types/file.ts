import { Collaborator, CollaboratorActions } from "./collaborator.ts";
import { Owner } from "./user.ts";

export interface File {
  _id: string;
  name: string;
  folder?: FolderDetails;
  description: string;
  owner: Owner;
  isLocked: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface FileData {
  name: string;
  isLocked: boolean;
  description: string;
  role: CollaboratorActions;
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
  owner: Owner;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFile {
  name: string;
  collaborators: Collaborator[];
  description: string;
}
