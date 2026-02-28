import { Request, Response } from "express";
import AsyncHandler from "@/utils/AsyncHandler";
import canvasStateModel from "@/models/canvasState.model";

const saveCanvasState = AsyncHandler(async (req: Request, res: Response) => {
   const { snapshot } = req.body;
   const fileId = req.params.fileId;

   if (!snapshot || !fileId) {
      return res.status(400).json({ message: "Missing snapshot or fileId" });
   }

   const update = await canvasStateModel.findOneAndUpdate(
      { fileId },
      { snapshot },
      { upsert: true, new: true },
   );

   res.status(200).json({ message: "Canvas state saved", data: update });
});

export { saveCanvasState };
