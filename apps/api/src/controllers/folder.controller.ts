import { Request, Response } from "express";
import { isValidObjectId, Types } from "mongoose";

import { Folder, FolderFileBridge } from "../models";
import zodParserHelper from "@/types/zod/zodParserHelper";
import {
   createFolderSchema,
   updateFolderSchema,
} from "../types/zod/folder.schema";
import { AsyncHandler, ApiResponse, ErrorHandler } from "../utils";

const getFolders = AsyncHandler(async (req: Request, res: Response) => {
   const userId = req.userId;

   const folders = await Folder.aggregate([
      {
         $match: {
            ownerId: userId,
            state: "active",
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
            email: 1,
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

const getFolderFiles = AsyncHandler(async (req: Request, res: Response) => {
   const { folderId } = req.params;
   const userId = req.userId;

   if (!isValidObjectId(folderId)) {
      throw new ErrorHandler({
         statusCode: 400,
         message: "Invalid folder id",
      });
   }

   const folderFiles = await Folder.aggregate([
      {
         $match: {
            _id: new Types.ObjectId(folderId),
            ownerId: userId,
            state: "active",
         },
      },
      {
         $addFields: {
            currentUser: userId,
         },
      },
      {
         $lookup: {
            from: "folderbridges",
            let: {
               folderId: "$_id",
               currentUser: "$currentUser",
            },
            pipeline: [
               {
                  $match: {
                     $expr: {
                        $and: [
                           {
                              $eq: ["$folderId", "$$folderId"],
                           },
                           {
                              $eq: ["$userId", "$$currentUser"],
                           },
                        ],
                     },
                  },
               },
               {
                  $lookup: {
                     from: "files",
                     localField: "fileId",
                     foreignField: "_id",
                     as: "fileDoc",
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
                                          $concat: [
                                             "$firstName",
                                             " ",
                                             "$lastName",
                                          ],
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
                              state: 1,
                              owner: {
                                 $arrayElemAt: ["$owner", 0],
                              },
                           },
                        },
                     ],
                  },
               },
               { $unwind: "$fileDoc" },
               {
                  $match: { "fileDoc.state": "active" },
               },
               {
                  $lookup: {
                     from: "deletedfiles",
                     let: {
                        fileId: "$fileId",
                        currentUser: "$$currentUser",
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
                  $replaceRoot: { newRoot: "$fileDoc" },
               },
            ],
            as: "files",
         },
      },
      {
         $replaceWith: {
            $setField: {
               field: "currentUser",
               input: "$$ROOT",
               value: "$$REMOVE",
            },
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
});

// TODO: Implement search folder query
const searchFolders = AsyncHandler(async (req: Request, res: Response) => {
   const { name = "" } = req.query as { name: string };

   if (name?.length <= 0) {
      throw new ErrorHandler({
         statusCode: 400,
         message: "Folder name is required",
      });
   }

   // const folders = await Folder.find().byName(name);
   const folders = ["something"];

   console.log("Response is: ", folders);

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
});

const createFolder = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const { folderName, files } = zodParserHelper(
         createFolderSchema,
         req.body,
      );
      const userId = req.userId;

      const folder = await Folder.create({
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
         const fileData = files.map((id) => ({
            userId,
            fileId: id,
            folderId: folder._id,
         }));

         const insertIntoFolderBridges =
            await FolderFileBridge.insertMany(fileData);

         if (insertIntoFolderBridges.length <= 0) {
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

const updateFolder = AsyncHandler(
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

      const updatedFolder = await Folder.findOneAndUpdate(
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

const deleteFolder = AsyncHandler(
   async (req: Request, res: Response): Promise<void> => {
      const { folderId } = req.params;
      const userId = req.userId;

      if (!isValidObjectId(folderId)) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "Invalid folder id",
         });
      }

      const folder = await Folder.findOneAndDelete({
         _id: folderId,
         ownerId: userId,
      });

      if (!folder) {
         throw new ErrorHandler({
            statusCode: 500,
            message: "Folder not deleted, please try again.",
         });
      }

      await FolderFileBridge.deleteMany({
         folderId,
         userId,
      });

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            message: "Folder deleted successfully",
         }),
      );
   },
);

const trashFolder = AsyncHandler(async (req: Request, res: Response) => {
   const { folderId } = req.params;
   const userId = req.userId;

   if (!isValidObjectId(folderId)) {
      throw new ErrorHandler({
         statusCode: 400,
         message: "Invalid folder id",
      });
   }

   const trashFolder = await Folder.findOneAndUpdate(
      {
         _id: folderId,
         ownerId: userId,
      },
      {
         $set: {
            state: "deleted",
         },
      },
      {
         returnDocument: "after",
      },
   );

   if (!trashFolder) {
      throw new ErrorHandler({
         statusCode: 500,
         message: "Failed to remove folder",
      });
   }

   res.status(200).json(
      new ApiResponse({
         statusCode: 200,
         message: "Folder removed successfully",
      }),
   );
});

const recoverFolder = AsyncHandler(async (req: Request, res: Response) => {
   const { folderId } = req.params;
   const userId = req.userId;

   if (!isValidObjectId(folderId)) {
      throw new ErrorHandler({
         statusCode: 400,
         message: "Invalid folder id",
      });
   }

   const recoverFolder = await Folder.findOneAndUpdate(
      {
         _id: folderId,
         ownerId: userId,
      },
      {
         $set: {
            state: "active",
         },
      },
      {
         returnDocument: "after",
      },
   );

   if (!recoverFolder) {
      throw new ErrorHandler({
         statusCode: 500,
         message: "Failed to recover folder",
      });
   }

   res.status(200).json(
      new ApiResponse({
         statusCode: 200,
         message: "Folder recover successfully",
      }),
   );
});

export {
   getFolders,
   getFolderFiles,
   searchFolders,
   createFolder,
   updateFolder,
   deleteFolder,
   trashFolder,
   recoverFolder,
};
