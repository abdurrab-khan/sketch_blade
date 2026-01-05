import { isValidObjectId, Types } from "mongoose";

import AsyncHandler from "@/utils/AsyncHandler";
import ErrorHandler from "@/utils/ErrorHandler";

import FileModel from "@/models/file.model";
import type { Request, Response, NextFunction } from "express";

const validateFileOwnership = AsyncHandler(
   async (req: Request, _: Response, next: NextFunction) => {
      const { fileId } = req.params;
      const userId = req.userId;

      if (!isValidObjectId(fileId)) {
         throw new ErrorHandler({
            statusCode: 400,
            message: "Invalid file id: there is no file with this id",
         });
      }

      const file = await FileModel.aggregate([
         {
            $match: {
               _id: new Types.ObjectId(fileId),
            },
         },
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
                  isOwner: "$isOwner",
                  fileId: "$_id",
                  currentUser: "$currentUser",
               },
               pipeline: [
                  {
                     $match: {
                        $expr: {
                           $and: [
                              {
                                 $ne: ["$$isOwner", true],
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
               as: "colls",
            },
         },
         {
            $match: {
               $expr: {
                  $or: [
                     {
                        $eq: ["$isOwner", true],
                     },
                     {
                        $gt: [{ $size: "$colls" }, 0],
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
                        _id: 0,
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
                     {
                        $eq: [
                           {
                              $arrayElemAt: ["$folder.state", 0],
                           },
                           "active",
                        ],
                     },
                  ],
               },
            },
         },
         {
            $project: {
               name: 1,
               isOwner: 1,
               collaborator: {
                  $arrayElemAt: ["$colls", 0],
               },
               isLocked: 1,
            },
         },
      ]);

      console.log("Current file is: ", file);

      if (file.length === 0) {
         throw new ErrorHandler({
            statusCode: 404,
            message: "Invalid file id, there is not file with this id",
         });
      }

      req.file = file[0];
      next();
   },
);

export default validateFileOwnership;
