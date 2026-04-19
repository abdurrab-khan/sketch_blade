import type { Request, Response } from "express";

import { AsyncHandler } from "@/utils";
import { loadAsset, storeAsset } from "@/utils/assets";

// To enable blob storage for assets, we add simple endpoints supporting PUT and GET requests
const updateAsset = AsyncHandler(async (req: Request, res: Response) => {
   const id = req.params.id;
   await storeAsset(id, req.body);
   res.json({ ok: true });
});

const getAsset = AsyncHandler(async (req: Request, res: Response) => {
   const id = req.params.id;
   const data = await loadAsset(id);
   res.send(data);
});

export { updateAsset, getAsset };
