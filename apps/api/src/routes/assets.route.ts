import express, { Router } from "express";
import { getAsset, updateAsset } from "@/controllers/assets.controller";

const router = Router();

router
   .route("/uploades/:id")
   .get(getAsset)
   .put(express.raw({ type: "*/*", limit: "50mb" }), updateAsset);
// router.get("/unfurl", unfurling);

export default router;
