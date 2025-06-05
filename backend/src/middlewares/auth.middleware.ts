import { NextFunction, Request, Response } from "express";
import { verifyToken } from "@clerk/express";
import AsyncHandler from "../utils/AsyncHandler";
import ApiResponse from "../utils/ApiResponse";

const userMiddleware = AsyncHandler(
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         const authHeader = req.headers.authorization;
         const token = authHeader && authHeader.replace("Bearer ", "");

         if (!token)
            return res.status(401).json(
               new ApiResponse({
                  message: "Authorization token is required",
                  statusCode: 401,
               }),
            );

         // const session = await verifyToken(token, {
         //    secretKey: process.env.CLERK_SECRET_KEY,
         // });

         // req.userId = session.sub;
         req.userId = "user_2y1uwvm6q4I96kZYVXUI9zi4Fqk";
         next();
      } catch (err) {
         return res.status(401).json(
            new ApiResponse({
               message: "token is not valid",
               statusCode: 401,
            }),
         );
      }
   },
);

export default userMiddleware;
