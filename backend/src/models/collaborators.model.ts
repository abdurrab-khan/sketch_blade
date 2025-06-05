import { Schema, model, Document } from "mongoose";
import { CollaboratorAction } from "../types";

export interface ICollaborator extends Document {
   fileId: Schema.Types.ObjectId;
   userId: string;
   actions: CollaboratorAction[];
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
   },
   actions: [
      {
         type: String,
         enum: Object.values(CollaboratorAction),
         required: true,
         validate: {
            validator: function (value: CollaboratorAction) {
               return Object.values(CollaboratorAction).includes(value);
            },
            message: (props: { value: CollaboratorAction }) =>
               `${props.value} is not a valid action`,
         },
      },
   ],
});

const Collaborator = model<ICollaborator>("Collaborator", collaboratorSchema);

export default Collaborator;
