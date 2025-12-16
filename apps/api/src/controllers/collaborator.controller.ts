import { Request, Response } from "express";
import { isValidObjectId, Types } from "mongoose";

import { Collaborator, User } from "../models";
import zodParserHelper from "../types/zod/zodParserHelper";
import { AsyncHandler, ApiResponse, ErrorHandler } from "../utils";
import {
   addCollaboratorSchema,
   removeCollaboratorSchema,
   updateCollaboratorSchema,
} from "../types/zod/collaborators.schema";

export const getCollaborators = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const { fileId } = req.params;

      if (!isValidObjectId(fileId)) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "Invalid file id",
         });
      }

      const fileCollaborators = await Collaborator.aggregate([
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
                        "createdAt",
                     ],
                  },
               ],
            },
         },
         {
            $replaceRoot: {
               newRoot: {
                  $mergeObjects: [
                     "$$ROOT",
                     {
                        $arrayElemAt: ["$user", 0],
                     },
                  ],
               },
            },
         },
         {
            $project: {
               role: 1,
               fullName: 1,
               profileUrl: 1,
               email: 1,
            },
         },
      ]);

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            data: fileCollaborators,
            message:
               fileCollaborators.length === 0
                  ? "No collaborators found"
                  : "Collaborators fetched successfully",
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

      if (!file || !file.isOwner) {
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
      const { collaboratorIds } = zodParserHelper(
         removeCollaboratorSchema,
         req.body ?? {},
      );
      const file = req.file;

      if (!file || !file.isOwner) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "User is not authorized to remove collaborators",
         });
      }

      const updatedFile = await Collaborator.deleteMany({
         _id: {
            $in: collaboratorIds,
         },
      });

      console.log(
         "Collaborator ids are: ",
         updatedFile,
         " ---- delete count is: ",
         collaboratorIds,
      );

      if (updatedFile.deletedCount === 0) {
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

      if (!file || !file.isOwner) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "You are not authorized to change collaborator permission",
         });
      }

      const updatedCollaborator = await Collaborator.findByIdAndUpdate(
         collaboratorId,
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
