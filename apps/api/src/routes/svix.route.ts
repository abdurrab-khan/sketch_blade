import { Request, Response, Router } from "express";
import { svixController } from "@/controllers/svix.controller";

const svixRouter = Router();

svixRouter
   .post("/webhook/clerk", svixController);

export default svixRouter;
