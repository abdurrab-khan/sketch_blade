import type { Request, Response } from "express";
import { ApiResponse, AsyncHandler } from "@/utils";
import { Collaborator, File, Folder } from "@/models";

const getStat = AsyncHandler(async (req: Request, res: Response) => {
   const userId = req.userId;

   const fileDetails = await File.aggregate([
      {
         $match: {
            ownerId: userId,
            state: "active",
         },
      },
      {
         $lookup: {
            from: "collaborators",
            let: {
               fileId: "$_id",
            },
            pipeline: [
               {
                  $match: {
                     $expr: {
                        $eq: ["$fileId", "$$fileId"],
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
         $group: {
            _id: null,
            totalDiagrams: { $sum: 1 },
            totalCollaborators: {
               $sum: {
                  $ifNull: [
                     { $arrayElemAt: ["$totalCollaborators.count", 0] },
                     0,
                  ],
               },
            },
         },
      },
      {
         $project: {
            _id: 0,
            totalDiagrams: 1,
            totalCollaborators: 1,
         },
      },
   ]);
   const totalFolders = await Folder.countDocuments({
      ownerId: userId,
      state: "active",
   });
   const sharedDiagrams = await Collaborator.countDocuments({
      userId,
      role: {
         $ne: "owner",
      },
   });

   const stats = {
      totalFolders: totalFolders || 0,
      totalDiagrams: fileDetails[0]?.totalDiagrams || 0,
      totalCollaborators: fileDetails[0]?.totalCollaborators || 0,
      totalSharedDiagrams: sharedDiagrams || 0,
   };

   res.status(200).json(
      new ApiResponse({
         statusCode: 200,
         data: stats,
         message: "Stat found successfully",
      }),
   );
});

export default getStat;
