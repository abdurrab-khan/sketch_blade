import { Request, Response } from "express";
import { Error, isValidObjectId, Types } from "mongoose";
import { CollaboratorAction } from "../types";
import zodParserHelper from "../types/zod/zodParserHelper";
import { AsyncHandler, ApiResponse, ErrorHandler } from "../utils";
import {
   File,
   DeletedFile,
   FavoriteFile,
   Folder,
   FolderFileBridge,
   Collaborator,
   User,
} from "../models";
import {
   createFileSchema,
   deleteFilesSchema,
   updateFileSchema,
   moveFile,
   transferOwnershipSchema,
} from "../types/zod/file.schema";

const getFile = AsyncHandler(async (req: Request, res: Response) => {
   const userId = req.userId;
   const { fileId } = req.params;

   if (!isValidObjectId(fileId)) {
      throw new ErrorHandler({
         statusCode: 400,
         message: "Invalid file id",
      });
   }

   const file = await File.aggregate([
      {
         $match: {
            _id: new Types.ObjectId(fileId),
         },
      },
      {
         $lookup: {
            from: "collaborators",
            let: { file_id: "$_id" },
            pipeline: [
               {
                  $match: {
                     $expr: {
                        $and: [
                           { $eq: ["$fileId", "$$file_id"] },
                           {
                              $eq: ["$userId", userId],
                           },
                        ],
                     },
                  },
               },
               { $project: { _id: 0, role: 1 } },
            ],
            as: "collaborator",
         },
      },
      {
         $match: {
            $expr: {
               $or: [
                  {
                     $eq: ["$ownerId", userId],
                  },
                  {
                     $and: [
                        {
                           $eq: ["$state", "active"],
                        },
                        {
                           $gt: [{ $size: "$collaborator" }, 0],
                        },
                     ],
                  },
               ],
            },
         },
      },
      {
         $addFields: {
            role: {
               $cond: {
                  if: { $gt: [{ $size: "$collaborator" }, 0] },
                  then: { $arrayElemAt: ["$collaborator.role", 0] },
                  else: "owner",
               },
            },
         },
      },
      {
         $project: {
            name: 1,
            isLocked: 1,
            description: 1,
            role: 1,
         },
      },
   ]);

   if (file.length === 0) {
      throw new ErrorHandler({
         statusCode: 404,
         message: "File not found",
      });
   }

   res.status(200).json(
      new ApiResponse({
         statusCode: 200,
         data: file[0],
         message: "File found successfully",
      }),
   );
});

const getFiles = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const userId = req.userId;

      const files = await File.aggregate([
         {
            $addFields: {
               isOwner: {
                  $cond: {
                     if: {
                        $eq: ["$ownerId", userId],
                     },
                     then: true,
                     else: false,
                  },
               },
            },
         },
         {
            $lookup: {
               from: "collaborators",
               let: {
                  fileId: "$_id",
                  isOwner: "$isOwner",
               },
               pipeline: [
                  {
                     $match: {
                        $expr: {
                           $and: [
                              {
                                 $eq: ["$$isOwner", false],
                              },
                              {
                                 $eq: ["$fileId", "$$fileId"],
                              },
                              {
                                 $eq: ["$userId", userId],
                              },
                           ],
                        },
                     },
                  },
                  {
                     $project: { _id: 1 },
                  },
               ],
               as: "collaborators",
            },
         },
         {
            $match: {
               $expr: {
                  $or: [
                     {
                        $and: [
                           {
                              $eq: ["$isOwner", true],
                           },
                           {
                              $ne: ["$state", "deleted"],
                           },
                        ],
                     },
                     {
                        $and: [
                           {
                              $ne: ["$state", "deleted"],
                           },
                           {
                              $gt: [{ $size: "$collaborators" }, 0],
                           },
                        ],
                     },
                  ],
               },
            },
         },
         {
            $lookup: {
               from: "deletedfiles",
               let: {
                  fileId: "$fileId",
                  isOwner: "$isOwner",
               },
               pipeline: [
                  {
                     $match: {
                        $expr: {
                           $and: [
                              {
                                 $eq: ["$$isOwner", false],
                              },
                              {
                                 $eq: ["$fileId", "$$fileId"],
                              },
                              {
                                 $eq: ["$userId", userId],
                              },
                           ],
                        },
                     },
                  },
               ],
               as: "deleted",
            },
         },
         {
            $match: {
               $expr: {
                  $or: [
                     {
                        $ne: ["$isOwner", true],
                     },
                     {
                        $lte: [{ $size: "$deleted" }, 0],
                     },
                  ],
               },
            },
         },
         {
            $lookup: {
               from: "folderBridges",
               let: {
                  fileId: "$_id",
               },
               pipeline: [
                  {
                     $match: {
                        $expr: {
                           $and: [
                              {
                                 $eq: ["$fileId", "$$fileId"],
                              },
                              {
                                 $eq: ["$userId", userId],
                              },
                           ],
                        },
                     },
                  },
                  {
                     $project: {
                        _id: 1,
                     },
                  },
               ],
               as: "folderId",
            },
         },
         {
            $addFields: {
               folderId: { $arrayElemAt: ["$folderId", 0] },
            },
         },
         {
            $lookup: {
               from: "folders",
               let: {
                  fileId: "$_id",
               },
               pipeline: [
                  {
                     $match: {
                        $expr: {
                           $and: [
                              {
                                 $ne: ["$folderId", null],
                              },
                              {
                                 $eq: ["$fileId", "$$fileId"],
                              },
                              {
                                 $eq: ["$ownerId", userId],
                              },
                           ],
                        },
                     },
                  },
               ],
               as: "folder",
            },
         },
         {
            $match: {
               $expr: {
                  $or: [
                     {
                        $lte: [{ $size: "$folder" }, 0],
                     },
                     { $in: ["active", "$folder.state"] },
                  ],
               },
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
               description: 1,
               isLocked: 1,
               updatedAt: 1,
               createdAt: 1,
               folder: {
                  $arrayElemAt: ["$folderData", 0],
               },
               owner: { $arrayElemAt: ["$owner", 0] },
            },
         },
         {
            $sort: { createdAt: -1 },
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

const getTrashFiles = AsyncHandler(async (req: Request, res: Response) => {
   const userId = req.userId;

   const trashedFiles = await File.aggregate([
      {
         $match: {
            $or: [
               {
                  status: {
                     $elemMatch: {
                        userId: userId,
                        role: "owner",
                     },
                  },
               },
               {
                  $and: [
                     {
                        status: {
                           $elemMatch: {
                              userId: userId,
                              role: {
                                 $ne: "owner",
                              },
                           },
                        },
                     },
                     {
                        status: {
                           $not: {
                              $elemMatch: {
                                 role: "owner",
                              },
                           },
                        },
                     },
                  ],
               },
            ],
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
         $addFields: {
            type: "file",
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
            owner: {
               $arrayElemAt: ["$owner", 0],
            },
            type: 1,
         },
      },
      {
         $sort: { createdAt: -1 },
      },
   ]);

   res.status(200).json(
      new ApiResponse({
         statusCode: 200,
         data: trashedFiles,
         message: "Files found successfully",
      }),
   );
});

const getSharedFiles = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const userId = req.userId;

      const collaborators = await Collaborator.find({
         userId: {
            $eq: userId,
         },
         role: {
            $ne: "owner",
         },
      });

      let files = [];

      if (collaborators && collaborators.length > 0) {
         const fileIds = collaborators.map(
            (c) => new Types.ObjectId(c.fileId.toString()),
         );

         files = await File.aggregate([
            {
               $match: {
                  _id: {
                     $in: fileIds,
                  },
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
                  isLocked: 1,
                  description: 1,
                  updatedAt: 1,
                  createdAt: 1,
                  owner: {
                     $arrayElemAt: ["$owner", 0],
                  },
               },
            },
         ]);
      }

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            data: files,
            message:
               files.length > 0
                  ? "Shared File found successfully."
                  : "No shared file found",
         }),
      );
   },
);

const getFavoriteFiles = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const userId = req.userId;

      const files = await File.aggregate([
         {
            $lookup: {
               from: "collaborators",
               localField: "_id",
               foreignField: "fileId",
               as: "collaborators",
            },
         },
         {
            $match: {
               $and: [
                  {
                     $or: [
                        {
                           ownerId: userId,
                        },
                        {
                           collaborators: {
                              $elemMatch: {
                                 userId: userId,
                              },
                           },
                        },
                     ],
                  },
                  {
                     isFavorite: true,
                  },
               ],
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
               owner: {
                  $arrayElemAt: ["$owner", 0],
               },
            },
         },
         {
            $sort: { createdAt: -1 },
         },
      ]);

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            data: files,
            message: "File found successfully",
         }),
      );
   },
);

const createFile = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const userId = req.userId;
      const { fileName, folderId, description } = zodParserHelper(
         createFileSchema,
         req.body ?? {},
      );

      const file = await File.create({
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

      res.status(201).json(
         new ApiResponse({
            statusCode: 201,
            message: "File created successfully",
         }),
      );
   },
);

const updateFile = AsyncHandler(
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

      const updatedFile = await File.findByIdAndUpdate(fileId, {
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

const deleteFile = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const { fileId } = req.params;
      const userId = req.userId;

      if (!isValidObjectId(fileId)) {
         throw new ErrorHandler({
            statusCode: 403,
            message: "Invalid file id provided",
         });
      }

      const file = await File.findById(fileId).lean();

      if (!file) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "Invalid file id, there is not file with this id.",
         });
      }

      // User is not owner
      if (file.ownerId !== userId) {
         await Collaborator.deleteOne({ fileId, userId });
         await FolderFileBridge.deleteOne({ fileId, userId });
         await FavoriteFile.deleteOne({ fileId, userId });
         await DeletedFile.deleteOne({ fileId, userId });
      } else {
         // User is owner
         await FolderFileBridge.deleteMany({ fileId });
         await Collaborator.deleteMany({ fileId });
         await FavoriteFile.deleteMany({ fileId });
         await DeletedFile.deleteMany({ fileId });
         await File.findByIdAndDelete(fileId);
      }

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            message: "File deleted successfully",
         }),
      );
   },
);

const trashFile = AsyncHandler(async (req: Request, res: Response) => {
   const userId = req.userId;
   const { fileId } = req.params;

   if (!isValidObjectId(fileId)) {
      throw new ErrorHandler({
         statusCode: 400,
         message: "Invalid file id",
      });
   }

   const file = await File.findById(fileId).lean();

   if (!file) {
      throw new ErrorHandler({
         statusCode: 400,
         message: "Invalid file id, there is not file with this id",
      });
   }

   // User is not owner
   if (file.ownerId !== userId) {
      const collaborator = await Collaborator.findOne({
         fileId: fileId,
         userId: userId,
      }).lean();

      if (!collaborator) {
         throw new ErrorHandler({
            statusCode: 403,
            message: "Invalid request",
         });
      }

      const trashRes = DeletedFile.create({ fileId, userId });

      if (!trashRes) {
         throw new ErrorHandler({
            statusCode: 500,
            message: "Failed to remove this file",
         });
      }

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            message: "File removed successfully",
         }),
      );
      return;
   }

   // User is owner
   const updateFile = await File.findByIdAndUpdate(fileId, {
      $set: {
         state: "deleted",
      },
   });

   if (!updateFile) {
      throw new ErrorHandler({
         statusCode: 500,
         message: "Failed to remove this file",
      });
   }

   res.status(200).json(
      new ApiResponse({
         statusCode: 200,
         message: "File removed successfully",
      }),
   );
});

const recoverFile = AsyncHandler(async (req: Request, res: Response) => {
   const userId = req.userId;
   const { fileId } = req.params;

   if (!isValidObjectId(fileId)) {
      throw new ErrorHandler({
         statusCode: 400,
         message: "Invalid file id",
      });
   }

   const file = await File.findById(fileId).lean();

   if (!file) {
      throw new ErrorHandler({
         statusCode: 404,
         message: "There is no file with this id",
      });
   }

   // User is not owner
   if (file.ownerId !== userId) {
      const removeDelete = await DeletedFile.deleteOne({ fileId });

      if (removeDelete.deletedCount === 0) {
         throw new ErrorHandler({
            statusCode: 500,
            message: "Failed to recover the file",
         });
      }
   } else {
      // User is owner
      const updateFile = await File.findByIdAndUpdate(fileId, {
         $set: {
            state: "active",
         },
      });

      if (!updateFile) {
         throw new ErrorHandler({
            statusCode: 500,
            message: "Failed to recover the file",
         });
      }
   }

   res.status(200).json(
      new ApiResponse({
         statusCode: 200,
         message: "File recover successfully",
      }),
   );
});

const toggleLock = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const { fileId } = req.params;
      const file = req.file;

      if (!file) {
         throw new ErrorHandler({
            statusCode: 403,
            message: "Your are not authorized to lock/unlock this file",
         });
      }

      const updatedFile = await File.findOneAndUpdate(
         { _id: fileId },
         {
            isLocked: !file?.isLocked,
         },
         { new: true },
      ).lean();

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

const transferFileOwnership = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const { fileId } = req.params;
      const userId = req.userId;
      const { userId: newOwnerId } = zodParserHelper(
         transferOwnershipSchema,
         req.body ?? {},
      );

      const file = await File.findById(fileId).lean();

      if (!file) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "Invalid file id, there is not file with this id",
         });
      }

      if (file.ownerId !== userId) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "You are not authorized to transfer file ownership",
         });
      }

      if (file.ownerId === newOwnerId) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "You can't transfer file with you",
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
      await File.findByIdAndUpdate(fileId, {
         $set: { ownerId: newOwnerId },
      });

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            message: "File ownership transferred successfully",
         }),
      );
   },
);

const toggleFavoriteFile = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const userId = req.userId;
      const { fileId } = req.params;

      if (!isValidObjectId(fileId)) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "Invalid file id",
         });
      }

      const file = await File.findById(fileId).lean();

      if (!file) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "Invalid Request file not found",
         });
      }

      const favorite = await FavoriteFile.findOne({
         fileId,
         userId,
      }).lean();

      // favorite attached with fileId, userId
      if (favorite) {
         const deleteRes = await FavoriteFile.findByIdAndDelete(favorite._id);

         if (!deleteRes) {
            throw new ErrorHandler({
               statusCode: 500,
               message: "Failed to remove file as favorite",
            });
         }

         res.status(200).json(
            new ApiResponse({
               statusCode: 200,
               message: "File successfully removed as favorite",
            }),
         );
         return;
      }

      // favorite not attached, attach favorite to file, userId
      const createRes = await FavoriteFile.create({
         fileId,
         userId,
      });

      if (!createRes) {
         throw new ErrorHandler({
            statusCode: 500,
            message: "Failed to make file as favorite",
         });
      }

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            message: `File successfully updated as favorite`,
         }),
      );
   },
);

const moveFileIntoFolder = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const userId = req.userId;
      const { fileId, folderId } = zodParserHelper(moveFile, req.params ?? {});

      const folderBridge = await FolderFileBridge.findOne({
         folderId,
         fileId,
      });

      if (folderBridge) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "You can't move file into another folder",
         });
      }

      const folder = await Folder.findOne({
         _id: folderId,
         ownerId: userId,
         state: {
            $eq: "active",
         },
      });

      if (!folder) {
         throw new ErrorHandler({
            statusCode: 404,
            message: "Invalid folder id, there is not folder with this id",
         });
      }

      const file = await File.aggregate([
         {
            $match: {
               _id: new Types.ObjectId(fileId),
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
            $match: {
               collaborators: {
                  $elemMatch: {
                     userId: userId,
                  },
               },
            },
         },
      ]);

      if (file.length === 0) {
         throw new ErrorHandler({
            statusCode: 404,
            message: "Invalid file id",
         });
      }

      const movedToFolder = await FolderFileBridge.create({
         userId,
         fileId: fileId,
         folderId: folderId,
      });

      if (!movedToFolder) {
         throw new ErrorHandler({
            statusCode: 500,
            message: `Failed to move file into folder ${folder.name}`,
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

export {
   getFile,
   getFiles,
   getTrashFiles,
   getSharedFiles,
   getFavoriteFiles,
   createFile,
   updateFile,
   deleteFile,
   trashFile,
   recoverFile,
   toggleLock,
   transferFileOwnership,
   toggleFavoriteFile,
   moveFileIntoFolder,
};
