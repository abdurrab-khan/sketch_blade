import { Request, Response } from "express";
import { isValidObjectId, Types } from "mongoose";

import Collaborator from "../models/collaborators.model";
import { AsyncHandler, ApiResponse, ErrorHandler } from "../utils";

import { CollaboratorAction } from "../types";
import { CollaboratorPayload } from "../types/file/collaborator";

export const getCollaborators = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const { fileId } = req.params;

      if (!isValidObjectId(fileId)) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "Invalid file id",
         });
      }

      const findFileCollaborators = await Collaborator.aggregate([
         {
            $match: {
               fileId: new Types.ObjectId(fileId),
            },
         },
         {
            $lookup: {
               from: "users",
               localField: "userId",
               foreignField: "clerkId",
               as: "user",
               pipeline: [
                  {
                     $addFields: {
                        fullName: {
                           $concat: ["$firstName", " ", "$lastName"],
                        },
                     },
                  },
                  {
                     $unset: [
                        "_id",
                        "clerkId",
                        "firstName",
                        "lastName",
                        "updatedAt",
                     ],
                  },
               ],
            },
         },
         {
            $project: {
               user: { $arrayElemAt: ["$user", 0] },
               actions: 1,
            },
         },
      ]);

      if (!findFileCollaborators.length) {
         throw new ErrorHandler({
            statusCode: 404,
            message: "Collaborators are not found",
         });
      }

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            data: findFileCollaborators,
            message: "Collaborators are found successfully.",
         }),
      );
   },
);

export const addCollaborator = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const { collaborators }: { collaborators: CollaboratorPayload[] } =
         req.body;
      const file = req.file;

      if (!file) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "User is not authorized to add new collaborators",
         });
      }

      if (!collaborators || !collaborators.length) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "Collaborators is required",
         });
      }

      let newCollaborators;
      if (collaborators.length === 1) {
         newCollaborators = await Collaborator.create(collaborators[0]);
      } else {
         newCollaborators = await Collaborator.insertMany(collaborators);
      }

      if (!newCollaborators) {
         throw new ErrorHandler({
            statusCode: 500,
            message: "Failed to add collaborator",
         });
      }

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            message: "Collaborators are added successfully",
         }),
      );
   },
);

export const removeCollaborator = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const { collaboratorIds }: { collaboratorIds: string[] } = req.body;
      const file = req.file;

      if (!file) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "User is not authorized to remove collaborators",
         });
      }

      if (!Array.isArray(collaboratorIds) || !collaboratorIds?.length) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "CollaboratorIds is required to remove collaborators",
         });
      }

      let updatedFile;
      if (collaboratorIds.length === 1) {
         updatedFile = await Collaborator.findByIdAndDelete(collaboratorIds[0]);
      } else {
         updatedFile = await Collaborator.deleteMany({
            userId: { $in: collaboratorIds },
         });
      }

      if (!updatedFile) {
         throw new ErrorHandler({
            statusCode: 500,
            message: "Failed to remove collaborators",
         });
      }

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            data: updatedFile,
            message: "Collaborators are removed successfully",
         }),
      );
   },
);

export const changeCollaboratorPermission = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const { actions }: { actions: CollaboratorAction[] } = req.body;
      const userId = req.userId;
      const file = req.file;

      if (!file) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "You are not authorized to change collaborator permission",
         });
      }

      if (!Array.isArray(actions) || !actions.length) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "Collaborator is required",
         });
      }

      const updatedCollaborator = await Collaborator.findOneAndUpdate(
         {
            fileId: file._id,
            userId,
         },
         {
            $set: {
               actions: actions,
            },
         },
      );

      if (!updatedCollaborator) {
         throw new ErrorHandler({
            statusCode: 500,
            message: "Failed to change permission.",
         });
      }

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            message: "Collaborator permission changed successfully",
         }),
      );
   },
);
