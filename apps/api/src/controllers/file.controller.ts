import { Request, Response } from "express";
import { isValidObjectId, Types } from "mongoose";
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
   updateFileSchema,
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

   res.status(200).json(
      new ApiResponse({
         statusCode: 200,
         data: file[0],
         message:
            file?.length === 0 ? "No file found" : "Files found successfully",
      }),
   );
});

const getFiles = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const userId = req.userId;

      const files = await File.aggregate([
         {
            $addFields: {
               currentUser: userId,
            },
         },
         {
            $addFields: {
               isOwner: {
                  $cond: {
                     if: {
                        $eq: ["$ownerId", "$currentUser"],
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
                  currentUser: "$currentUser",
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
                                 $eq: ["$userId", "$$currentUser"],
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
                  $and: [
                     {
                        $eq: ["$state", "active"],
                     },
                     {
                        $or: [
                           {
                              $eq: ["$isOwner", true],
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
                  fileId: "$_id",
                  isOwner: "$isOwner",
                  currentUser: "$currentUser",
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
                                 $eq: ["$userId", "$$currentUser"],
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
                        $and: [
                           {
                              $eq: ["$isOwner", true],
                           },
                           {
                              $eq: ["$state", "active"],
                           },
                        ],
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
               from: "folderbridges",
               let: {
                  fileId: "$_id",
                  currentUser: "$currentUser",
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
                                 $eq: ["$userId", "$$currentUser"],
                              },
                           ],
                        },
                     },
                  },
                  {
                     $project: {
                        folderId: 1,
                     },
                  },
               ],
               as: "folderId",
            },
         },
         {
            $addFields: {
               folderId: {
                  $arrayElemAt: ["$folderId.folderId", 0],
               },
            },
         },
         {
            $lookup: {
               from: "folders",
               localField: "folderId",
               foreignField: "_id",
               pipeline: [
                  {
                     $project: {
                        _id: 0,
                        name: 1,
                        state: 1,
                        createdAt: 1,
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
            $lookup: {
               from: "favoritefiles",
               let: {
                  fileId: "$_id",
                  currentUser: "$currentUser",
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
                                 $eq: ["$userId", "$$currentUser"],
                              },
                           ],
                        },
                     },
                  },
               ],
               as: "favoritefiles",
            },
         },
         {
            $project: {
               name: 1,
               isLocked: 1,
               description: 1,
               updatedAt: 1,
               createdAt: 1,
               folder: {
                  $arrayElemAt: ["$folder", 0],
               },
               owner: { $arrayElemAt: ["$owner", 0] },
               isFavorite: {
                  $cond: {
                     if: { $gt: [{ $size: "$favoritefiles" }, 0] },
                     then: true,
                     else: false,
                  },
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
            message:
               files?.length === 0
                  ? "No file found"
                  : "Files found successfully",
         }),
      );
   },
);

const getSharedFiles = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const userId = req.userId;

      const files = await Collaborator.aggregate([
         {
            $addFields: {
               currentUser: userId,
            },
         },
         {
            $match: {
               $expr: { $eq: ["$userId", "$currentUser"] },
            },
         },
         {
            $lookup: {
               from: "deletedfiles",
               let: {
                  fileId: "$fileId",
                  currentUser: "$currentUser",
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
                                 $eq: ["$userId", "$$currentUser"],
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
                  $lte: [{ $size: "$deleted" }, 0],
               },
            },
         },
         {
            $lookup: {
               from: "files",
               localField: "fileId",
               foreignField: "_id",
               as: "file",
               pipeline: [
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
                        state: 1,
                        isFavorite: 1,
                        description: 1,
                        updatedAt: 1,
                        createdAt: 1,
                        folder: {
                           $arrayElemAt: ["$folder", 0],
                        },
                        owner: { $arrayElemAt: ["$owner", 0] },
                     },
                  },
               ],
            },
         },
         {
            $match: {
               $expr: {
                  $and: [
                     { $in: ["active", "$file.state"] },
                     {
                        $gt: [{ $size: "$file" }, 0],
                     },
                  ],
               },
            },
         },
         {
            $lookup: {
               from: "folderbridges",
               let: {
                  fileId: "$_id",
                  currentUser: "$currentUser",
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
                                 $eq: ["$userId", "$$currentUser"],
                              },
                           ],
                        },
                     },
                  },
                  {
                     $project: {
                        folderId: 1,
                     },
                  },
               ],
               as: "folderId",
            },
         },
         {
            $addFields: {
               folderId: {
                  $arrayElemAt: ["$folderId.folderId", 0],
               },
            },
         },
         {
            $lookup: {
               from: "folders",
               let: {
                  folderId: "$folderId",
                  currentUser: "$currentUser",
               },
               pipeline: [
                  {
                     $match: {
                        $expr: {
                           $and: [
                              {
                                 $ne: ["$$folderId", null],
                              },
                              {
                                 $eq: ["$_id", "$$folderId"],
                              },
                              {
                                 $eq: ["$ownerId", "$$currentUser"],
                              },
                           ],
                        },
                     },
                  },
                  {
                     $project: {
                        _id: 0,
                        name: 1,
                        state: 1,
                        createdAt: 1,
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
            $replaceRoot: {
               newRoot: {
                  $mergeObjects: [
                     {
                        collaboratorId: "$_id",
                     },
                     { $arrayElemAt: ["$file", 0] },
                     {
                        folder: {
                           $arrayElemAt: ["$folder", 0],
                        },
                     },
                  ],
               },
            },
         },
      ]);

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

      const files = await FavoriteFile.aggregate([
         {
            $addFields: {
               currentUser: userId,
            },
         },
         {
            $match: {
               $expr: { $eq: ["$userId", "$currentUser"] },
            },
         },
         {
            $lookup: {
               from: "deletedfiles",
               let: {
                  fileId: "$fileId",
                  currentUser: "$currentUser",
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
                                 $eq: ["$userId", "$$currentUser"],
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
                  $lte: [{ $size: "$deleted" }, 0],
               },
            },
         },
         {
            $lookup: {
               from: "files",
               localField: "fileId",
               foreignField: "_id",
               as: "file",
               pipeline: [
                  {
                     $project: {
                        name: 1,
                        isLocked: 1,
                        isFavorite: 1,
                        description: 1,
                        updatedAt: 1,
                        createdAt: 1,
                        state: 1,
                        folder: {
                           $arrayElemAt: ["$folder", 0],
                        },
                        owner: { $arrayElemAt: ["$owner", 0] },
                     },
                  },
               ],
            },
         },
         {
            $match: {
               $expr: {
                  $and: [
                     { $in: ["active", "$file.state"] },
                     {
                        $gt: [{ $size: "$file" }, 0],
                     },
                  ],
               },
            },
         },
         {
            $lookup: {
               from: "folderbridges",
               let: {
                  fileId: "$_id",
                  currentUser: "$currentUser",
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
                                 $eq: ["$userId", "$$currentUser"],
                              },
                           ],
                        },
                     },
                  },
                  {
                     $project: {
                        folderId: 1,
                     },
                  },
               ],
               as: "folderId",
            },
         },
         {
            $addFields: {
               folderId: {
                  $arrayElemAt: ["$folderId.folderId", 0],
               },
            },
         },
         {
            $lookup: {
               from: "folders",
               let: {
                  folderId: "$folderId",
                  currentUser: "$currentUser",
               },
               pipeline: [
                  {
                     $match: {
                        $expr: {
                           $and: [
                              {
                                 $ne: ["$$folderId", null],
                              },
                              {
                                 $eq: ["$_id", "$$folderId"],
                              },
                              {
                                 $eq: ["$ownerId", "$$currentUser"],
                              },
                           ],
                        },
                     },
                  },
                  {
                     $project: {
                        _id: 0,
                        name: 1,
                        state: 1,
                        createdAt: 1,
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
               localField: "userId",
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
            $replaceRoot: {
               newRoot: {
                  $mergeObjects: [
                     {
                        collaboratorId: "$_id",
                     },
                     { $arrayElemAt: ["$file", 0] },
                     {
                        folder: {
                           $arrayElemAt: ["$folder", 0],
                        },
                     },
                     {
                        owner: { $arrayElemAt: ["$owner", 0] },
                     },
                     {
                        isFavorite: true,
                     },
                  ],
               },
            },
         },
      ]);

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            data: files,
            message:
               files?.length === 0
                  ? "There is no shared file"
                  : "Favorite Files found successfully",
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

      const fileData = {
         _id: file._id,
         name: file.name,
         description: file.description,
         isLocked: file.isLocked,
      };

      res.status(201).json(
         new ApiResponse({
            statusCode: 201,
            data: fileData,
            message: "File created successfully",
         }),
      );
   },
);

const updateFile = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const file = req?.file;

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

      const file = await File.findById(fileId).lean();

      if (!file) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "Invalid file id, there is not file with this id",
         });
      }

      const isOwner = file.ownerId === userId;

      if (isOwner) {
         // User is owner
         await FolderFileBridge.deleteMany({ fileId });
         await Collaborator.deleteMany({ fileId });
         await FavoriteFile.deleteMany({ fileId });
         await DeletedFile.deleteMany({ fileId });
         await File.findByIdAndDelete(fileId);
      } else {
         // User is not owner
         const collaborator = await Collaborator.findOne({
            fileId,
            userId,
         });

         if (!collaborator) {
            throw new ErrorHandler({
               statusCode: 403,
               message: "You are not authorized to do this.",
            });
         }

         await Collaborator.deleteOne({ fileId, userId });
         await FolderFileBridge.deleteOne({ fileId, userId });
         await FavoriteFile.deleteOne({ fileId, userId });
         await DeletedFile.deleteOne({ fileId, userId });
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
   const file = req?.file;

   if (!file) {
      throw new ErrorHandler({
         statusCode: 403,
         message: "You are not authorized to delete this file",
      });
   }

   const fileId = file?._id;

   // Check already trash file exists;
   const existingTrashFile = await DeletedFile.findOne({
      fileId,
      userId,
   }).lean();

   if (existingTrashFile) {
      throw new ErrorHandler({
         statusCode: 400,
         message: "File has been already deleted",
      });
   }

   let role = file.isOwner ? "owner" : file.collaborator?.role;

   // adding entry in deleteFile
   const delEntry = await DeletedFile.create({ fileId, userId, role });

   if (!delEntry) {
      throw new ErrorHandler({
         statusCode: 500,
         message: "Failed to remove this file",
      });
   }

   // changing the file state from active to deleted
   if (file.isOwner) {
      const updatedFileRes = await File.findByIdAndUpdate(fileId, {
         $set: {
            state: "deleted",
         },
      });

      if (!updatedFileRes) {
         await DeletedFile.findByIdAndDelete(delEntry._id);

         throw new ErrorHandler({
            statusCode: 500,
            message: "Failed to remove this file",
         });
      }
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

   // User is owner
   if (file.ownerId === userId) {
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

   // Delete entry from DeletedFile collection
   const removeDelete = await DeletedFile.deleteOne({ fileId, userId });

   if (removeDelete.deletedCount === 0) {
      throw new ErrorHandler({
         statusCode: 500,
         message: "Failed to recover the file",
      });
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
      const file = req?.file;

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
      const file = req?.file;

      if (!file) {
         throw new ErrorHandler({
            statusCode: 403,
            message: "You are not authorized to toggle favorite",
         });
      }

      const fileId = file._id;

      // checking out file already exist??
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

         // return after successfully deleting
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
      const file = req?.file;

      // check getting file from middleware
      if (!file) {
         throw new ErrorHandler({
            statusCode: 403,
            message: "You are not authorized to move this file",
         });
      }

      const fileId = file._id;
      const { folderId } = req.params;

      // checking folderId is valid or not
      if (!isValidObjectId(folderId)) {
         throw new ErrorHandler({
            statusCode: 403,
            message: "Invalid folder id",
         });
      }

      const folderBridge = await FolderFileBridge.findOne({
         fileId,
         userId,
      }).lean();

      if (folderBridge) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "You can't move file into another folder",
         });
      }

      const folder = await Folder.findOne({
         _id: folderId,
         ownerId: userId,
      }).lean();

      if (!folder) {
         throw new ErrorHandler({
            statusCode: 404,
            message: "Invalid folder id, there is not folder with this id",
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
            message: `File moved successfully into folder ${folder.name}`,
         }),
      );
   },
);

export {
   getFile,
   getFiles,
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
