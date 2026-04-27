import type { Request, Response } from "express";

import { AsyncHandler } from "@/utils";
import ErrorHandler from "@/utils/ErrorHandler";
import { loadAsset, removeAsset, storeAsset } from "@/utils/assets";

// To enable blob storage for assets, we add simple endpoints supporting upload, get and delete requests
const updateAsset = AsyncHandler(async (req: Request, res: Response) => {
   const id = req.params.id;
   await storeAsset(id, req.body);
   res.json({ ok: true });
});

const getAsset = AsyncHandler(async (req: Request, res: Response) => {
   const id = req.params.id;
   let data: Buffer;

   try {
      data = await loadAsset(id);
   } catch (error: any) {
      if (error?.code === "ENOENT") {
         throw new ErrorHandler({
            statusCode: 404,
            message: "Asset not found",
         });
      }

      throw error;
   }

   res.send(data);
});

const deleteAsset = AsyncHandler(async (req: Request, res: Response) => {
   const id = req.params.id;

   await removeAsset(id);
   res.json({ ok: true });
});

export { updateAsset, getAsset, deleteAsset };
