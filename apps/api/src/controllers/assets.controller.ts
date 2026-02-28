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

// To enable unfurling of bookmarks, we add a simple endpoint that takes a URL query param
// const unfurling = AsyncHandler(async (req, res) => {
//    const url = req.query.url as string;
//    if (!url) {
//       return res.status(400).json({ error: "URL parameter required" });
//    }
//    const result = await unfurl(url);
//    return res.json(result);
// });

export { updateAsset, getAsset };
