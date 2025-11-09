export type CollaboratorActions = "owner" | "editor" | "viewer" | "commenter";

export enum CollaboratorAction {
  Owner = "owner",
  Edit = "edit",
  View = "view",
  Comment = "comment",
}

export interface CollaboratorUser {
  _id: string;
  fullName: string;
  email: string;
  profileUrl: string;
}

export interface ActiveCollaborators {
  _id: string;
  details: {
    fullName: string;
    profileUrl: string;
    email: string;
  };
  active: boolean;
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
