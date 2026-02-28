import type { Request, Response } from "express";
import { ApiResponse, AsyncHandler } from "@/utils";
import { File } from "@/models";

const getStat = AsyncHandler(async (req: Request, res: Response) => {
   const userId = req.userId;

   const stat = await File.aggregate([
      {
         $facet: {
            totalDiagrams: [
               {
                  $match: {
                     ownerId: userId,
                     state: "active",
                  },
               },
               {
                  $count: "count",
               },
            ],
            totalFolders: [
               {
                  $match: {
                     ownerId: userId,
                  },
               },
               {
                  $lookup: {
                     from: "folders",
                     let: {
                        ownerId: userId,
                     },
                     pipeline: [
                        {
                           $match: {
                              $expr: {
                                 $and: [
                                    {
                                       $eq: ["$ownerId", "$$ownerId"],
                                    },
                                    {
                                       $eq: ["$state", "active"],
                                    },
                                 ],
                              },
                           },
                        },
                        {
                           $count: "count",
                        },
                     ],
                     as: "folderCount",
                  },
               },
               {
                  $replaceRoot: {
                     newRoot: {
                        $arrayElemAt: ["$folderCount", 0],
                     },
                  },
               },
            ],
            totalSharedDiagrams: [
               {
                  $match: {
                     ownerId: userId,
                     state: "active",
                  },
               },
               {
                  $group: {
                     _id: null,
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
                           $group: {
                              _id: "$fileId",
                           },
                        },
                        {
                           $count: "count",
                        },
                     ],
                     as: "sharedCount",
                  },
               },
               {
                  $project: {
                     count: {
                        $ifNull: [
                           {
                              $arrayElemAt: ["$sharedCount.count", 0],
                           },
                           0,
                        ],
                     },
                  },
               },
            ],
         },
      },
      {
         $project: {
            totalDiagrams: {
               $ifNull: [
                  {
                     $arrayElemAt: ["$totalDiagrams.count", 0],
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
            totalSharedDiagrams: {
               $ifNull: [
                  {
                     $arrayElemAt: ["$totalSharedDiagrams.count", 0],
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
