import { Request, Response } from "express";
import { isValidObjectId, Types } from "mongoose";
import File from "../models/file.model";
import FolderModel from "../models/folder.model";
import { CreateFolderRequest } from "../types/folder";
import { AsyncHandler, ApiResponse, ErrorHandler } from "../utils";

export const createFolder = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const { folderName, files }: CreateFolderRequest = req.body;
      const userId = req.userId;

      const folder = await FolderModel.create({
         name: folderName,
         creatorId: userId,
      });

      if (!folder) {
         throw new ErrorHandler({
            statusCode: 500,
            message: "folder not created, please try again.",
         });
      }

      if (Array.isArray(files) && files.length > 0) {
         const file = await File.updateMany(
            {
               _id: { $in: files },
            },
            {
               folderId: folder._id,
            },
         );

         if (file.matchedCount === 0) {
            await FolderModel.findByIdAndDelete(folder._id);

            throw new ErrorHandler({
               statusCode: 500,
               message: "folder not updated, please try again.",
            });
         }
      }

      res.status(201).json(
         new ApiResponse({
            statusCode: 201,
            message: "folder created successfully",
            data: folder,
         }),
      );
   },
);

export const updateFolder = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const { folderName } = req.body;
      const userId = req.userId;

      if (!folderName) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "folder name is required",
         });
      }

      if (!userId) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "invalid creator id",
         });
      }

      if (!isValidObjectId(id)) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "invalid folder id",
         });
      }

      const updatedFolder = await FolderModel.findOneAndUpdate(
         {
            _id: id,
            creatorId: userId,
         },
         {
            $set: {
               name: folderName,
            },
         },
      );

      if (!updatedFolder) {
         throw new ErrorHandler({
            statusCode: 500,
            message: "folder not updated, please try again.",
         });
      }

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            message: "folder updated successfully",
         }),
      );
   },
);

export const deleteFolder = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const { folderId } = req.params;
      const userId = req.userId;

      if (!userId) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "invalid creator id",
         });
      }

      if (!isValidObjectId(folderId)) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "invalid folder id",
         });
      }

      const folder = await FolderModel.findOneAndDelete({
         _id: folderId,
         creatorId: userId,
      });

      if (!folder) {
         throw new ErrorHandler({
            statusCode: 500,
            message: "folder not deleted, please try again.",
         });
      }

      await File.updateMany(
         {
            folderId: folderId,
         },
         {
            $set: {
               folderId: null,
            },
         },
      );

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            message: "folder deleted successfully",
         }),
      );
   },
);

export const getFolders = AsyncHandler(async (req: Request, res: Response) => {
   const userId = req.userId;

   const folders = await FolderModel.aggregate([
      {
         $match: {
            creatorId: new Types.ObjectId(userId),
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
                     fullName: {
                        $concat: ["$firstName", " ", "$lastName"],
                     },
                     profileUrl: 1,
                  },
               },
            ],
         },
      },
      {
         $project: {
            folder_name: 1,
            createdAt: 1,
            updatedAt: 1,
            creator: {
               $arrayElemAt: ["$creator", 0],
            },
         },
      },
   ]);

   if (!folders) {
      throw new ErrorHandler({
         statusCode: 404,
         message: "folders are not found",
      });
   }
   res.status(200).json(
      new ApiResponse({
         statusCode: 200,
         message: "folders found successfully",
         data: folders,
      }),
   );
});

export const getFoldersForFiles = AsyncHandler(
   async (req: Request, res: Response) => {
      const userId = req.userId;

      if (!userId) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "invalid creator id",
         });
      }

      const folders = await FolderModel.find({
         creatorId: userId,
      });

      if (!folders || folders.length === 0) {
         throw new ErrorHandler({
            statusCode: 200,
            message:
               "there are no folders to move the file, please create a folder",
         });
      }

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            message: "folders found successfully",
            data: folders,
         }),
      );
   },
);

export const getFolderFiles = AsyncHandler(
   async (req: Request, res: Response) => {
      const { folderId } = req.params;
      const userId = req.userId;

      if (!isValidObjectId(folderId)) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "invalid folder id",
         });
      }

      const folderFiles = await FolderModel.aggregate([
         {
            $match: {
               folderId: new Types.ObjectId(folderId),
            },
         },
         {
            $lookup: {
               from: "files",
               let: { folderId: "$_id" },
               pipeline: [
                  {
                     $match: {
                        $expr: {
                           $eq: ["$folderId", "$$folderId"],
                        },
                     },
                  },
                  {
                     $lookup: {
                        from: "collaborators",
                        localField: "_id",
                        foreignField: "fileId",
                        as: "collaborators",
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
                                 fullName: {
                                    $concat: ["$firstName", " ", "$lastName"],
                                 },
                                 profileUrl: 1,
                              },
                           },
                        ],
                     },
                  },
                  {
                     $addFields: {
                        creator: {
                           $arrayElemAt: ["$creator", 0],
                        },
                     },
                  },
                  {
                     $match: {
                        $or: [
                           { creatorId: new Types.ObjectId(userId) },
                           {
                              collaborators: {
                                 $elemMatch: {
                                    userId: new Types.ObjectId(userId),
                                 },
                              },
                           },
                        ],
                     },
                  },
                  {
                     $project: {
                        name: 1,
                        creatorId: 1,
                        creator: 1,
                        isLocked: 1,
                        collaborators: 1,
                     },
                  },
               ],
               as: "files",
            },
         },
         {
            $project: {
               name: 1,
               files: 1,
               createdAt: 1,
               updatedAt: 1,
            },
         },
      ]);

      if (!folderFiles) {
         res.status(200).json(
            new ApiResponse({
               data: null,
               statusCode: 200,
               message: "no files found in this folder",
            }),
         );
      }

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            data: folderFiles,
            message: "files found successfully",
         }),
      );
   },
);

export const moveFileIntoFolder = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const { folderId } = req.params;
      const { fileId } = req.body;
      const userId = req.userId;

      if (!isValidObjectId(fileId) || !isValidObjectId(folderId)) {
         throw new ErrorHandler({
            statusCode: 400,
            message: `invalid ${!isValidObjectId(fileId) ? "file" : "folder"} id`,
         });
      }

      const updatedFile = await File.updateOne(
         {
            _id: fileId,
            creator: userId,
         },
         {
            $set: {
               folderId: folderId,
            },
         },
         { new: true },
      );

      if (updatedFile.matchedCount === 0) {
         throw new ErrorHandler({
            statusCode: 403,
            message: "you are not authorized to move this file.",
         });
      }

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            data: updatedFile,
            message: "file moved successfully",
         }),
      );
   },
);
