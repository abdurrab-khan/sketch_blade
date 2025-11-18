import { Request, Response } from "express";
import { Error, isValidObjectId, Types } from "mongoose";
import FileModel from "../models/file.model";
import Collaborator from "../models/collaborators.model";
import { AsyncHandler, ApiResponse, ErrorHandler } from "../utils";
import zodParserHelper from "../types/zod/zodParserHelper";
import {
   createFileSchema,
   deleteFilesSchema,
   transferOwnershipSchema,
   updateFileSchema,
} from "../types/zod/file.schema";
import { User } from "../models/user.model";
import { CollaboratorAction } from "../types";

// UTILS
const deleteFileWithCollaborators = async (fileId: Types.ObjectId) => {
   try {
      await Collaborator.deleteMany({ fileId });
      await FileModel.findByIdAndDelete(fileId);
   } catch (error) {
      const err = error as Error;
      throw new ErrorHandler({
         statusCode: 500,
         message: err?.message || "File not deleted",
      });
   }
};

// CONTROLLERS
export const getFile = AsyncHandler(async (req: Request, res: Response) => {
   const userId = req.userId;
   const { fileId } = req.params;

   if (!isValidObjectId(fileId)) {
      throw new ErrorHandler({
         statusCode: 400,
         message: "File id is invalid",
      });
   }

   const file = await FileModel.aggregate([
      {
         $match: {
            _id: new Types.ObjectId(fileId),
         },
      },
      {
         $lookup: {
            from: "collaborators",
            foreignField: "fileId",
            localField: "_id",
            as: "collaborator",
         },
      },
      {
         $match: {
            $or: [
               {
                  ownerId: userId,
               },
               {
                  collaborator: {
                     $elemMatch: {
                        userId: userId,
                     },
                  },
               },
            ],
         },
      },
      {
         $project: {
            name: 1,
            isLocked: 1,
            description: 1,
            updatedAt: 1,
            createdAt: 1,
         },
      },
   ]);

   if (file.length === 0) {
      res.status(404).json(
         new ErrorHandler({
            statusCode: 404,
            message: "File not found",
         }),
      );
      return;
   }

   res.status(200).json(
      new ApiResponse({
         statusCode: 200,
         data: file,
         message: "File found successfully",
      }),
   );
});

export const getFiles = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const userId = req.userId;

      const files = await FileModel.aggregate([
         {
            $lookup: {
               from: "collaborators",
               localField: "_id",
               foreignField: "fileId",
               as: "collaborator",
            },
         },
         {
            $match: {
               $or: [
                  {
                     ownerId: userId,
                  },
                  {
                     collaborator: {
                        $elemMatch: {
                           userId: userId,
                        },
                     },
                  },
               ],
            },
         },
         {
            $lookup: {
               from: "users",
               localField: "ownerId",
               foreignField: "clerkId",
               as: "creator",
               pipeline: [
                  {
                     $project: {
                        _id: 0,
                        fullName: {
                           $concat: ["$firstName", " ", "$lastName"],
                        },
                        profileUrl: 1,
                        email: 1,
                     },
                  },
               ],
            },
         },
         {
            $lookup: {
               from: "folders",
               localField: "folderId",
               foreignField: "_id",
               as: "folder",
               pipeline: [
                  {
                     $project: {
                        name: 1,
                     },
                  },
               ],
            },
         },
         {
            $project: {
               name: 1,
               description: 1,
               isLocked: 1,
               updatedAt: 1,
               createdAt: 1,
               folder: {
                  $arrayElemAt: ["$folder", 0],
               },
               creator: {
                  $arrayElemAt: ["$creator", 0],
               },
            },
         },
         {
            $sort: { createdAt: -1 }, // Sort by most recently updated
         },
      ]);

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            data: files,
            message:
               files?.length === 0
                  ? "No file found"
                  : "Files fetched successfully",
         }),
      );
   },
);

export const createFile = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const userId = req.userId;
      const { fileName, folderId, description } = zodParserHelper(
         createFileSchema,
         req.body ?? {},
      );

      const file = await FileModel.create({
         name: fileName,
         folderId: folderId ?? null,
         ownerId: userId,
         description,
      });

      if (!file) {
         throw new ErrorHandler({
            statusCode: 500,
            message: "File not created, please try again",
         });
      }

      const createCollaborator = await Collaborator.create({
         fileId: file._id,
         userId,
         role: CollaboratorAction.Owner,
      });

      if (!createCollaborator) {
         await FileModel.findByIdAndDelete(file._id);

         throw new ErrorHandler({
            statusCode: 500,
            message: "File not created, please try again",
         });
      }

      const returnObj = {
         name: file.name,
         isLocked: file.isLocked,
         description: file.description,
         updatedAt: file.updatedAt,
         createdAt: file.createdAt,
      };

      res.status(201).json(
         new ApiResponse({
            statusCode: 201,
            data: returnObj,
            message: "File created successfully",
         }),
      );
   },
);

export const updateFile = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const file = req.file;

      if (!file) {
         throw new ErrorHandler({
            statusCode: 403,
            message: "You are not authorized to update this file",
         });
      }

      const { fileId } = req.params ?? {};
      const { fileName, description } = zodParserHelper(
         updateFileSchema,
         req.body ?? {},
      );

      if (!isValidObjectId(fileId)) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "Invalid file id: there is no file with this id",
         });
      }

      const updatedFile = await FileModel.findByIdAndUpdate(fileId, {
         name: fileName,
         description,
      });

      if (!updatedFile) {
         throw new ErrorHandler({
            statusCode: 500,
            message: "File not updated",
         });
      }

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            message: "File updated successfully",
         }),
      );
   },
);

export const deleteFile = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const { fileId } = req.params;
      const userId = req.userId;

      if (!isValidObjectId(fileId)) {
         throw new ErrorHandler({
            statusCode: 403,
            message: "Invalid file id provided",
         });
      }

      const collaborators = await Collaborator.findOne({
         fileId,
         userId,
      });

      if (collaborators?.role === CollaboratorAction.Owner) {
         await deleteFileWithCollaborators(new Types.ObjectId(fileId));
      } else {
         const deleteCollaborator = Collaborator.deleteOne({
            fileId,
            userId,
         });

         if (!deleteCollaborator) {
            throw new ErrorHandler({
               statusCode: 500,
               message: "File not deleted",
            });
         }
      }

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            message: "File deleted successfully",
         }),
      );
   },
);

export const deleteFiles = AsyncHandler(async (req: Request, res: Response) => {
   const userId = req.userId;
   const { fileIds } = zodParserHelper(deleteFilesSchema, req.body ?? {});

   const collaborators = await Collaborator.find({
      fileId: { $in: fileIds },
      userId: userId,
   }).lean();

   if (collaborators.length === 0) {
      throw new ErrorHandler({
         statusCode: 403,
         message: "There are no files to delete",
      });
   }

   // File delete
   const deletePromise = collaborators.map((coll) => {
      const fileId = coll.fileId.toString();
      const isOwner = coll.role === CollaboratorAction.Owner;

      if (isOwner) {
         return deleteFileWithCollaborators(new Types.ObjectId(fileId));
      } else {
         return Collaborator.findOneAndDelete({
            fileId,
            userId: coll.userId,
         });
      }
   });

   const promiseResult = await Promise.allSettled(deletePromise);
   const failedDeletions = promiseResult.filter(
      (result) => result.status === "rejected",
   );

   if (failedDeletions.length > 0) {
      throw new ErrorHandler({
         statusCode: 500,
         message: `${failedDeletions.length} files failed to delete`,
      });
   }

   return res.status(200).json(
      new ApiResponse({
         statusCode: 200,
         message: `${fileIds.length} files deleted successfully${failedDeletions.length > 0 ? ` with ${failedDeletions.length} failures` : ""}`,
      }),
   );
});

export const toggleLock = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const { fileId } = req.params;
      const file = req.file;

      if (!file) {
         throw new ErrorHandler({
            statusCode: 403,
            message: "Your are not authorized to lock/unlock this file",
         });
      }

      const updatedFile = await FileModel.findOneAndUpdate(
         { _id: fileId },
         {
            isLocked: !file?.isLocked,
         },
         { new: true },
      );

      if (!updatedFile) {
         throw new ErrorHandler({
            statusCode: 500,
            message: `Failed to ${file.isLocked ? "unlock" : "lock"} file`,
         });
      }

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            message: `File ${file.isLocked ? "unlock" : "lock"} successfully`,
         }),
      );
   },
);

export const transferFileOwnership = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const { fileId } = req.params;
      const userId = req.userId;
      const { userId: newOwnerId } = zodParserHelper(
         transferOwnershipSchema,
         req.body ?? {},
      );

      const file = await FileModel.findById(fileId).lean();
      if (!file || file?.ownerId.toString() !== userId) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "You are not authorized to transfer file ownership",
         });
      }

      if (file.ownerId === newOwnerId) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "New owner id cannot be the same as current owner id",
         });
      }

      const user = await User.findOne({ clerkId: newOwnerId }).lean();
      if (!user) {
         throw new ErrorHandler({
            statusCode: 404,
            message: "User not found",
         });
      }

      // Update file ownerId
      await FileModel.findByIdAndUpdate(fileId, {
         $set: { ownerId: newOwnerId },
      });

      // Update collaborators
      await Collaborator.updateMany(
         { fileId: file._id, userId: newOwnerId },
         { $set: { role: CollaboratorAction.Owner } },
      );

      await Collaborator.updateMany(
         { fileId: file._id, userId: userId },
         { $set: { role: CollaboratorAction.Edit } },
      );

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            message: "File ownership transferred successfully",
         }),
      );
   },
);
