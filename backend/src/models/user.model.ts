import { model, Schema, Document } from "mongoose";

interface IUser extends Document {
   firstName: string;
   lastName: string;
   email: string;
   profileUrl: string;
   clerkId: string;
   createdAt: Date;
   updatedAt: Date;
}

const userSchema = new Schema<IUser>(
   {
      firstName: {
         type: String,
         required: true,
         trim: true,
      },
      lastName: {
         type: String,
         trim: true,
      },
      email: {
         type: String,
         required: true,
         index: true,
         unique: true,
         lowercase: true,
         trim: true,
      },
      clerkId: {
         type: String,
         required: true,
         index: true,
         unique: true,
      },
      profileUrl: {
         type: String,
      },
   },
   { timestamps: true },
);

export const User = model("User", userSchema);
