import { NextFunction, Response, Request } from "express";
import AsyncHandler from "../utils/AsyncHandler";
import { isValidObjectId, Types } from "mongoose";
import ErrorHandler from "../utils/ErrorHandler";
import FileModel from "../models/file.model";
import { CollaboratorAction } from "../types";
import Collaborator from "../models/collaborators.model";
import { File } from "../types/file/file";
import { CollaboratorPayload } from "../types/file/collaborator";

const fileOwnershipValidator = AsyncHandler(
   async (req: Request, _: Response, next: NextFunction) => {
      const { fileId } = req.params;
      const userId = req.userId;

      if (!isValidObjectId(fileId)) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "Invalid file id: there is no file with this id",
         });
      }

      const file = (await FileModel.findById(fileId)) as unknown as File;

      if (!file) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "file is not found",
         });
      } else {
         if (file.ownerId.toString() !== userId) {
            const collaborator = await Collaborator.findOne({
               fileId: new Types.ObjectId(fileId),
               userId: userId,
               actions: {
                  $in: [CollaboratorAction.Edit],
               },
            });

            if (!collaborator) {
               req.file = null;
               return next();
            }

            file["collaborators"] =
               collaborator as unknown as CollaboratorPayload;
         }
      }

      req.file = file;
      next();
   },
);

export default fileOwnershipValidator;
