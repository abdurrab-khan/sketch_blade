import { Request, Response } from "express";
import { User } from "../models";
import { AsyncHandler, ApiResponse } from "../utils";

const getUserAsCollaborator = AsyncHandler(
   async (req: Request, res: Response) => {
      const email = req.query?.email?.toString();
      const userId = req.userId;

      if (!email || email?.trim() === "") {
         return res.status(400).json(
            new ApiResponse({
               statusCode: 200,
               message: "user name is required.",
            }),
         );
      }

      const findUser = await User.find(
         {
            email: { $regex: new RegExp(email, "i") },
            clerkId: { $ne: userId },
         },
         {
            fullName: {
               $concat: ["$firstName", " ", "$lastName"],
            },
            email: 1,
            profileUrl: 1,
         },
      );

      if (!findUser.length) {
         return res.status(200).json(
            new ApiResponse({
               statusCode: 200,
               data: [],
               message: "user not found.",
            }),
         );
      }

      res.status(200).json(
         new ApiResponse({
            statusCode: 200,
            data: findUser,
            message: "users are found.",
         }),
      );
   },
);

export default getUserAsCollaborator;
