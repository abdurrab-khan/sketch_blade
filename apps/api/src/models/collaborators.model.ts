import { Schema, model, Document } from "mongoose";
import { CollaboratorAction } from "@/types";

export interface ICollaborator extends Document {
   fileId: Schema.Types.ObjectId;
   userId: string;
   role: CollaboratorAction;
}

const collaboratorSchema = new Schema<ICollaborator>({
   fileId: {
      type: Schema.Types.ObjectId,
      ref: "File",
      required: true,
   },
   userId: {
      type: String,
      ref: "User",
      required: true,
      validate: {
         validator: async function (v: string) {
            const existingCollaborator = await this.model(
               "Collaborator",
            ).findOne({
               fileId: this.fileId,
               userId: v,
            });
            return existingCollaborator === null;
         },
         message: () => "User is already a collaborator for this file",
      },
   },
   role: {
      type: String,
      enum: Object.values(CollaboratorAction),
      required: true,
   },
});

const Collaborator = model<ICollaborator>("Collaborator", collaboratorSchema);

export default Collaborator;
