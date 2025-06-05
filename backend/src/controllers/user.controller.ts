import { Request, Response } from "express";
import { User } from "../models/user.model";
import { AsyncHandler, ApiResponse } from "../utils";

const getUserAsCollaborator = AsyncHandler(
   async (req: Request, res: Response) => {
      const { email, currentEmail } = req.body;

      if ((!email || email.trim() === "") && !currentEmail) {
         return res.status(400).json(
            new ApiResponse({
               statusCode: 200,
               message: "user name is required.",
            }),
         );
      }

      const findUser = await User.find(
         {
            email: { $regex: new RegExp(email, "i"), $ne: currentEmail },
         },
         {
            fullName: {
               $concat: ["$firstName", " ", "$lastName"],
            },
            email: 1,
            profileUrl: 1,
         },
      );

      if (!findUser) {
         return res.status(404).json(
            new ApiResponse({
               statusCode: 404,
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
