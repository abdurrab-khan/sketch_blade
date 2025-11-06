import { Request, Response } from "express";
import { isValidObjectId, Types } from "mongoose";

import Collaborator from "../models/collaborators.model";
import { AsyncHandler, ApiResponse, ErrorHandler } from "../utils";

import zodParserHelper from "../types/zod/zodParserHelper";
import {
   addCollaboratorSchema,
   removeCollaboratorSchema,
   updateCollaboratorSchema,
} from "../types/zod/collaborators.schema";
import { User } from "../models/user.model";

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
               role: 1,
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
      const file = req.file;
      const collaboratorsData = zodParserHelper(
         addCollaboratorSchema,
         req.body ?? {},
      );

      if (!file) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "You are not authorized to add collaborators",
         });
      }

      const collaborators = await Promise.all(
         collaboratorsData.map(async (collaborator) => {
            const { email, role } = collaborator;

            const user = await User.findOne({ email }).lean();

            if (!user) {
               throw new ErrorHandler({
                  statusCode: 400,
                  message: `User with email ${email} does not exist`,
               });
            }

            return {
               role: role,
               fileId: file._id,
               userId: user.clerkId,
            };
         }),
      );

      if (collaborators.length === 0) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "No valid collaborators to add",
         });
      }

      const createdCollaborators = await Collaborator.insertMany(collaborators);

      if (!createdCollaborators || createdCollaborators.length === 0) {
         throw new ErrorHandler({
            statusCode: 500,
            message: "Failed to add collaborators",
         });
      }

      res.status(200).json(
         new ApiResponse({
            statusCode: 201,
            message: "Collaborators are added successfully",
         }),
      );
   },
);

export const removeCollaborator = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const { collaboratorId } = zodParserHelper(
         removeCollaboratorSchema,
         req.body ?? {},
      );
      const file = req.file;

      if (!file) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "User is not authorized to remove collaborators",
         });
      }

      const updatedFile = await Collaborator.findOneAndDelete({
         fileId: file._id,
         _id: new Types.ObjectId(collaboratorId),
      });

      if (!updatedFile) {
         throw new ErrorHandler({
            statusCode: 500,
            message: "Failed to remove collaborator",
         });
      }

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            message: "Collaborators are removed successfully",
         }),
      );
   },
);

export const changeCollaboratorPermission = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const { collaboratorId, role } = zodParserHelper(
         updateCollaboratorSchema,
         req.body ?? {},
      );
      const file = req.file;

      if (!file) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "You are not authorized to change collaborator permission",
         });
      }

      const updatedCollaborator = await Collaborator.findOneAndUpdate(
         {
            fileId: file._id,
            _id: new Types.ObjectId(collaboratorId),
         },
         {
            $set: {
               role,
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
            message: `Collaborator role is changed to ${role} successfully.`,
         }),
      );
   },
);
