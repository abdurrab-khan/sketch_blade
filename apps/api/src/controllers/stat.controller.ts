import type { Request, Response } from "express";
import { ApiResponse, AsyncHandler } from "@/utils";
import { File } from "@/models";

const getStat = AsyncHandler(async (req: Request, res: Response) => {
   const userId = req.userId;

   const stat = await File.aggregate([
      {
         $match: {
            ownerId: userId,
         },
      },
      {
         $group: {
            _id: null,
            totalDiagrams: {
               $sum: 1,
            },
            ownerId: {
               $first: "$ownerId",
            },
            fileIds: {
               $push: "$_id",
            },
         },
      },
      {
         $lookup: {
            from: "collaborators",
            let: {
               fileIds: "$fileIds",
            },
            pipeline: [
               {
                  $match: {
                     $expr: {
                        $in: ["$fileId", "$$fileIds"],
                     },
                  },
               },
               {
                  $count: "count",
               },
            ],
            as: "totalCollaborators",
         },
      },
      {
         $lookup: {
            from: "collaborators",
            let: {
               userId: "$ownerId",
            },
            pipeline: [
               {
                  $match: {
                     $expr: {
                        $eq: ["$userId", "$$userId"],
                     },
                  },
               },
               {
                  $count: "count",
               },
            ],
            as: "totalSharedDiagrams",
         },
      },
      {
         $lookup: {
            from: "folders",
            let: {
               ownerId: "$ownerId",
            },
            pipeline: [
               {
                  $match: {
                     $expr: {
                        $eq: ["$ownerId", "$$ownerId"],
                     },
                  },
               },
               {
                  $count: "count",
               },
            ],
            as: "totalFolders",
         },
      },
      {
         $project: {
            _id: 0,
            totalDiagrams: 1,
            totalCollaborators: {
               $ifNull: [
                  {
                     $arrayElemAt: ["$totalCollaborators.count", 0],
                  },
                  0,
               ],
            },
            totalSharedDiagrams: {
               $ifNull: [
                  {
                     $arrayElemAt: ["$totalSharedDiagrams.count", 0],
                  },
                  0,
               ],
            },
            totalFolders: {
               $ifNull: [
                  {
                     $arrayElemAt: ["$totalFolders.count", 0],
                  },
                  0,
               ],
            },
         },
      },
   ]);

   const emptyStat = {
      totalFolders: 0,
      totalDiagrams: 0,
      totalCollaborators: 0,
      totalSharedDiagrams: 0,
   };

   res.status(200).json(
      new ApiResponse({
         statusCode: 200,
         data: stat[0] ?? emptyStat,
         message: "Stat found successfully",
      }),
   );
});

export default getStat;
