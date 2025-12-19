import { CollaboratorAction } from "..";
import { CollaboratorUser } from "../user";

export interface CollaboratorPayload {
   userId: CollaboratorUser;
   role: CollaboratorAction[];
}
