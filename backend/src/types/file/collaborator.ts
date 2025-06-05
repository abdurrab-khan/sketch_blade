import { CollaboratorAction } from "..";
import { CollaboratorUser } from "../user";

export interface CollaboratorPayload {
   fileId: string;
   userId: CollaboratorUser;
   actions: CollaboratorAction[];
}
