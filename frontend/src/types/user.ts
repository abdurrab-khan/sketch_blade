export type CollaboratorActions = "owner" | "editor" | "viewer" | "commenter";

export interface User {
  _id: string;
  name: string;
  email: string;
  clerkId: string;
}

export interface CreatorDetails {
  _id?: string;
  fullName: string;
  profileUrl: string;
}

export interface ActiveCollaborators {
  fullName: string;
  profileUrl: string;
  email: string;
}

export interface CollaboratorData {
  _id: string;
  fullName: string;
  profileUrl: string;
  actions: CollaboratorActions;
  email: string;
}

export interface ListCollaborator {
  _id: string;
  email: string;
  fullName: string;
  profileUrl: string;
}

export interface Collaborator {
  _id: string;
  email: string;
  fullName: string;
  profileUrl: string;
  actions: CollaboratorActions[];
}
