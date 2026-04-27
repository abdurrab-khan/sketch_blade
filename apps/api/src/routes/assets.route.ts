import express, { Router } from "express";
import {
   deleteAsset,
   getAsset,
   updateAsset,
} from "@/controllers/assets.controller";

const router = Router();

router.get("/:id", getAsset);
router.delete("/:id", deleteAsset);
router.post(
   "/upload/:id",
   express.raw({ type: "*/*", limit: "50mb" }),
   updateAsset,
);

export default router;
