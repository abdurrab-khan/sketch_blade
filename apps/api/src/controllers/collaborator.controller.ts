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
      const reqData = zodParserHelper(addCollaboratorSchema, req.body ?? {});

      if (!file || !file.isOwner) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "You are not authorized to add collaborators",
         });
      }

      const { email, role } = reqData;

      const user = await User.findOne({ email }).lean();

      if (!user) {
         throw new ErrorHandler({
            statusCode: 400,
            message: `User with email ${email} does not exist`,
         });
      }

      const createdCollaborator = await Collaborator.insertOne({
         fileId: file._id,
         userId: user.clerkId,
         role,
      });

      if (!createdCollaborator) {
         throw new ErrorHandler({
            statusCode: 500,
            message: "Failed to add collaborators",
         });
      }

      const resData = {
         _id: createdCollaborator._id,
         fullName: `${user.firstName} ${user.lastName}`,
         profileUrl: user.profileUrl,
         email: user.email,
         role: createdCollaborator.role,
      };

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            data: resData,
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

      if (!file || !file.isOwner) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "User is not authorized to remove collaborators",
         });
      }

      const deleteFile = await Collaborator.findByIdAndDelete(collaboratorId);

      if (!deleteFile) {
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
