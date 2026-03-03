import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Request, Response } from "express";
import { saveCanvasState } from "../controllers/canvas.controller";

const mockFindOneAndUpdate = jest.fn();

jest.mock("../models/canvasState.model", () => ({
   default: {
      findOneAndUpdate: (...args: any[]) => mockFindOneAndUpdate(...args),
   },
   __esModule: true,
}));

describe("Canvas Controller - saveCanvasState", () => {
   const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
   } as unknown as Response;

   beforeEach(() => jest.clearAllMocks());

   it("should return 400 when snapshot or fileId is missing", async () => {
      const mockReq = {
         body: {},
         params: {},
      } as unknown as Request;

      saveCanvasState(mockReq, mockRes, jest.fn());
      // saveCanvasState is wrapped in AsyncHandler which doesn't return the promise,
      // so we flush microtasks to let the handler complete
      await Promise.resolve();

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
         expect.objectContaining({ message: "Missing snapshot or fileId" }),
      );
   });

   it("should save canvas state and return 200 with saved data", async () => {
      const mockReq = {
         body: { snapshot: { document: { shapes: [] } } },
         params: { fileId: "file123" },
      } as unknown as Request;

      const savedDoc = {
         fileId: "file123",
         snapshot: { document: { shapes: [] } },
      };
      (mockFindOneAndUpdate as jest.Mock).mockResolvedValue(savedDoc);

      saveCanvasState(mockReq, mockRes, jest.fn());
      await Promise.resolve();
      await Promise.resolve();

      expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
         { fileId: "file123" },
         { snapshot: savedDoc.snapshot },
         { upsert: true, new: true },
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
         expect.objectContaining({ message: "Canvas state saved" }),
      );
   });
});
