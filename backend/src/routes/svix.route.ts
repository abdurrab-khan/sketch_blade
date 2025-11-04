import { Router } from "express";
import bodyParser from "body-parser";
import { svixController } from "../controllers/svix.controller";

const svixRouter = Router();

svixRouter
   .route("/webhook/clerk")
   .post(bodyParser.raw({ type: "application/json" }), svixController);

export default svixRouter;
