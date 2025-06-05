import { Request } from "express";
import { File } from "./file/file";

declare global {
   namespace Express {
      interface Request {
         userId?: string;
         file?: File | null;
      }
   }
}
