import { DeletedFile, Folder } from "@/models";
import { ApiResponse, AsyncHandler } from "@/utils";
import type { Request, Response } from "express";

const getTrashedData = AsyncHandler(async (req: Request, res: Response) => {
   const userId = req.userId;

   // getting -- all trashed folders
   const trashedFolders = await Folder.aggregate([
      {
         $match: {
            ownerId: userId,
            state: "deleted",
         },
      },
      {
         $lookup: {
            from: "users",
            localField: "ownerId",
            foreignField: "clerkId",
            as: "owner",
         },
      },
      {
         $project: {
            name: 1,
            state: 1,
            createdAt: 1,
            type: "folder",
            owner: {
               $arrayElemAt: ["$owner", 0],
            },
         },
      },
   ]);

   // getting -- all trashed files
   const trashedFiles = await DeletedFile.aggregate([
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
                     isFavorite: 1,
                     description: 1,
                     ownerId: 1,
                     state: 1,
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
         $addFields: {
            file: { $arrayElemAt: ["$file", 0] },
         },
      },
      {
         $match: {
            $expr: {
               $and: [
                  {
                     $or: [
                        {
                           $eq: ["$file.ownerId", "$currentUser"],
                        },
                        {
                           $eq: ["$file.state", "active"],
                        },
                     ],
                  },
                  {
                     $ne: ["$file", null],
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
                  "$file",
                  {
                     type: "file",
                  },
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
         data: [...trashedFiles, ...trashedFolders],
         message: "Trashed data found successfully",
      }),
   );
});

export default getTrashedData;
