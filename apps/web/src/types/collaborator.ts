export type CollaboratorActions = "owner" | "edit" | "view";

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

export interface ListCollaborator {
  _id: string;
  email: string;
  fullName: string;
  profileUrl: string;
}

export interface Collaborator {
  _id: string;
  fullName: string;
  profileUrl: string;
  email: string;
  role: CollaboratorActions;
}
