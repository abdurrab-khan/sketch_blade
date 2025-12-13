import { Request } from "express";
import { File } from "./file/file";

declare global {
   namespace Express {
      interface Request {
         userId?: string;
         file?: {
            _id: string;
            name: string;
            isOwner: boolean;
            isLocked: boolean;
            collaborator?: CollaboratorPayload;
         } | null;
      }
   }
}
