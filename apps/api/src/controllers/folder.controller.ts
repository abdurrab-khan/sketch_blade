import File from "../models/file.model";
import { Request, Response } from "express";
import FolderModel from "../models/folder.model";
import { isValidObjectId, Types } from "mongoose";
import zodParserHelper from "../types/zod/zodParserHelper";
import {
   createFolderSchema,
   updateFolderSchema,
} from "../types/zod/folder.schema";
import { AsyncHandler, ApiResponse, ErrorHandler } from "../utils";

export const getFolders = AsyncHandler(async (req: Request, res: Response) => {
   const userId = req.userId;

   const folders = await FolderModel.aggregate([
      {
         $match: {
            ownerId: userId,
         },
      },
      {
         $lookup: {
            from: "users",
            localField: "ownerId",
            foreignField: "clerkId",
            as: "owner",
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
         $project: {
            name: 1,
            ownerId: 1,
            createdAt: 1,
            updatedAt: 1,
            owner: {
               $arrayElemAt: ["$owner", 0],
            },
         },
      },
   ]);

   res.status(200).json(
      new ApiResponse({
         statusCode: 200,
         message:
            folders.length === 0
               ? "No folders found"
               : "Folders found successfully",
         data: folders,
      }),
   );
});

export const searchFolders = AsyncHandler(
   async (req: Request, res: Response) => {
      const query = req.query;

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            message: "Search folders successfully",
            data: [
               {
                  _id: "64b7f8e2c9e77b6f4d8e4a1a",
                  name: "Project Ideas",
                  createdAt: "2024-07-20T10:15:30.000Z",
                  updatedAt: "2024-07-22T14:25:45.000Z",
               },
               {
                  _id: "64b7f9a3c9e77b6f4d8e4a1b",
                  name: "Work Documents",
                  createdAt: "2024-07-18T09:05:20.000Z",
                  updatedAt: "2024-07-21T11:30:55.000Z",
               },
            ],
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
            message: "Invalid folder id",
         });
      }

      const folderFiles = await FolderModel.aggregate([
         {
            $match: {
               _id: new Types.ObjectId(folderId),
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
                        localField: "ownerId",
                        foreignField: "clerkId",
                        as: "owner",
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
                        owner: {
                           $arrayElemAt: ["$owner", 0],
                        },
                     },
                  },
                  {
                     $match: {
                        $or: [
                           { ownerId: userId },
                           {
                              collaborators: {
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
                        ownerId: 1,
                        owner: 1,
                        isLocked: 1,
                        folder: {
                           $arrayElemAt: ["$folder", 0],
                        },
                        createdAt: 1,
                        updatedAt: 1,
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

      if (folderFiles.length === 0) {
         res.status(404).json(
            new ApiResponse({
               data: null,
               statusCode: 404,
               message: "No files found in this folder",
            }),
         );
      }

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            data: folderFiles[0],
            message: "Files found successfully",
         }),
      );
   },
);

export const createFolder = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const { folderName, files } = zodParserHelper(
         createFolderSchema,
         req.body,
      );
      const userId = req.userId;

      const folder = await FolderModel.create({
         name: folderName,
         ownerId: userId,
      });

      if (!folder) {
         throw new ErrorHandler({
            statusCode: 500,
            message: "Folder not created, please try again.",
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
               message: "Folder not created, please try again.",
            });
         }
      }

      res.status(201).json(
         new ApiResponse({
            statusCode: 201,
            message: "Folder created successfully",
            data: folder,
         }),
      );
   },
);

export const updateFolder = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const userId = req.userId;
      const { folderId } = req.params;
      const { folderName } = zodParserHelper(updateFolderSchema, req?.body);

      if (!isValidObjectId(folderId)) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "Invalid folder id",
         });
      }

      const updatedFolder = await FolderModel.findOneAndUpdate(
         {
            _id: folderId,
            ownerId: userId,
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
            message: "Folder not updated, please try again.",
         });
      }

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            message: "Folder updated successfully",
         }),
      );
   },
);

export const deleteFolder = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const { folderId } = req.params;
      const userId = req.userId;

      if (!isValidObjectId(folderId)) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "Invalid folder id",
         });
      }

      const folder = await FolderModel.findOneAndDelete({
         _id: folderId,
         ownerId: userId,
      });

      if (!folder) {
         throw new ErrorHandler({
            statusCode: 500,
            message: "Folder not deleted, please try again.",
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
            message: "Folder deleted successfully",
         }),
      );
   },
);

export const moveFileIntoFolder = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const { fileId = null, folderId = null } = req.params;
      const userId = req.userId;

      if (!isValidObjectId(fileId) || !isValidObjectId(folderId)) {
         throw new ErrorHandler({
            statusCode: 400,
            message: `Invalid ${!isValidObjectId(fileId) ? "file" : "folder"} id`,
         });
      }

      const updatedFile = await File.findOneAndUpdate(
         {
            _id: fileId,
            ownerId: userId,
         },
         {
            $set: {
               folderId: folderId,
            },
         },
         { new: true },
      );

      if (updatedFile === null) {
         throw new ErrorHandler({
            statusCode: 403,
            message: "You are not authorized to move this file.",
         });
      }

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            message: "File moved successfully",
         }),
      );
   },
);
