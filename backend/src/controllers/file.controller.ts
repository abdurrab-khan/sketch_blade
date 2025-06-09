import { Request, Response } from "express";
import { isValidObjectId, Types } from "mongoose";
import FileModel from "../models/file.model";
import Collaborator from "../models/collaborators.model";
import { FileCreationPayload, FileUpdatingPayload } from "../types/file/file";
import { AsyncHandler, ApiResponse, ErrorHandler } from "../utils";
import { CollaboratorAction } from "../types";

export const createFile = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const { fileName, folderId, description }: FileCreationPayload = req.body;
      const userId = req.userId;

      if (folderId && !isValidObjectId(folderId)) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "invalid folder id",
         });
      }

      const file = await FileModel.create({
         name: fileName,
         folderId: folderId ?? null,
         creatorId: userId,
         description,
      });

      if (!file) {
         throw new ErrorHandler({
            statusCode: 500,
            message: "file not created, please try again",
         });
      }

      const createCollaborator = await Collaborator.create({
         fileId: file._id,
         userId,
         actions: [CollaboratorAction.Owner],
      });

      if (!createCollaborator) {
         await FileModel.findByIdAndDelete(file._id);

         throw new ErrorHandler({
            statusCode: 500,
            message: "file not created, please try again",
         });
      }

      res.status(201).json(
         new ApiResponse({
            statusCode: 201,
            data: file,
            message: "file created successfully",
         }),
      );
   },
);

export const updateFile = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const { fileId } = req.params;
      const { fileName, description }: FileUpdatingPayload = req.body;
      const file = req.file;

      if (!fileName && !description) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "file name or description is required",
         });
      }

      if (!file) {
         throw new ErrorHandler({
            statusCode: 403,
            message: "you are not authorized to update this file",
         });
      }

      const updatedFile = await FileModel.findByIdAndUpdate(
         fileId,
         {
            name: fileName,
            description,
         },
         { new: true },
      );

      if (!updatedFile) {
         throw new ErrorHandler({
            statusCode: 500,
            message: "file not updated",
         });
      }

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            message: "file updated successfully",
         }),
      );
   },
);

export const deleteFile = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const { ids = [] }: { ids: string[] } = req.body;
      const { fileId } = req.params;
      const ownerId = req.userId;

      if (!isValidObjectId(fileId)) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "invalid file id",
         });
      }

      const file = await FileModel.findById(fileId).lean();
      if (!file) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "invalid file id: file not found with this id",
         });
      }

      if (!Array.isArray(ids) || ids?.length === 0) {
         if (file.creatorId !== ownerId) {
            throw new ErrorHandler({
               statusCode: 400,
               message: "you are not authorized to delete this file",
            });
         }
      }

      if (ids?.length > 0) {
         const result = await Collaborator.deleteMany({
            fileId,
            userId: {
               $in: ids,
            },
            actions: {
               $nin: [CollaboratorAction.Owner],
            },
         });

         if (result.deletedCount === 0) {
            throw new ErrorHandler({
               statusCode: 404,
               message: "No collaborators found with the provided ids",
            });
         }
      } else {
         const collaborationDelete = await Collaborator.deleteMany({
            fileId: new Types.ObjectId(fileId),
         });

         if (collaborationDelete.deletedCount === 0) {
            throw new ErrorHandler({
               statusCode: 500,
               message: "failed to delete collaborators",
            });
         }

         const fileDelete = await FileModel.findByIdAndDelete(fileId);

         if (!fileDelete) {
            throw new ErrorHandler({
               statusCode: 500,
               message: "failed to delete file",
            });
         }
      }

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            message: "file deleted successfully",
         }),
      );
   },
);

export const toggleLock = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const { fileId } = req.params;
      const file = req.file;

      if (!file) {
         throw new ErrorHandler({
            statusCode: 403,
            message: "your are not authorized to lock/unlock this file",
         });
      }

      const updatedFile = await FileModel.updateOne(
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
            message: `file ${file.isLocked ? "unlock" : "lock"} successfully`,
         }),
      );
   },
);

export const getFile = AsyncHandler(async (req: Request, res: Response) => {
   const userId = req.userId;
   const { fileId } = req.params;

   if (!isValidObjectId(fileId)) {
      throw new ErrorHandler({
         statusCode: 400,
         message: "file id is invalid",
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
                  creatorId: userId,
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

   if (!file.length) {
      res.status(404).json(
         new ErrorHandler({
            statusCode: 404,
            message: "file not found",
         }),
      );
      return;
   }

   res.status(200).json(
      new ApiResponse({
         statusCode: 200,
         data: file,
         message: "file found successfully",
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
                     creatorId: userId,
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
               localField: "creatorId",
               foreignField: "clerkId",
               as: "creator",
               pipeline: [
                  {
                     $project: {
                        _id: 0,
                        fullName: { $concat: ["$firstName", " ", "$lastName"] },
                        profileUrl: 1,
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
               folder: { $arrayElemAt: ["$folder", 0] },
               creator: { $arrayElemAt: ["$creator", 0] },
            },
         },
         {
            $sort: { updatedAt: -1 }, // Sort by most recently updated
         },
      ]);

      if (!files?.length) {
         res.status(200).json(
            new ApiResponse({
               statusCode: 200,
               data: null,
               message: "no file found",
            }),
         );
         return;
      }

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            data: files,
            message: "files found successfully",
         }),
      );
   },
);
