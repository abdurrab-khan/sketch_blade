import { describe, it, expect, beforeAll, afterAll, jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../server";

jest.mock(
   "../middlewares/auth.middleware",
   () => (_req: any, _res: any, next: any) => {
      _req.userId = "test_user_id";
      next();
   },
);

jest.mock("@clerk/express", () => ({
   clerkMiddleware: () => (_req: any, _res: any, next: any) => next(),
   verifyToken: jest.fn(),
}));

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
   mongoServer = await MongoMemoryServer.create();
   await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
   await mongoose.disconnect();
   await mongoServer.stop();
});

describe("Canvas API - POST /v1/canvas/save/:fileId", () => {
   const testFileId = new mongoose.Types.ObjectId().toHexString();

   it("should save canvas state and return 200", async () => {
      const snapshot = { document: { store: {}, schema: {} } };

      const res = await request(app)
         .post(`/v1/canvas/save/${testFileId}`)
         .send({ snapshot });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Canvas state saved");
      expect(res.body.data.fileId).toBe(testFileId);
   });

   it("should update the existing canvas state on second save", async () => {
      const snapshot1 = { document: { store: { shape1: {} } } };
      const snapshot2 = { document: { store: { shape1: {}, shape2: {} } } };

      await request(app)
         .post(`/v1/canvas/save/${testFileId}`)
         .send({ snapshot: snapshot1 });

      const res = await request(app)
         .post(`/v1/canvas/save/${testFileId}`)
         .send({ snapshot: snapshot2 });

      expect(res.status).toBe(200);
      expect(res.body.data.snapshot.document.store).toHaveProperty("shape2");
   });

   it("should return 400 when snapshot is not provided", async () => {
      const res = await request(app)
         .post(`/v1/canvas/save/${testFileId}`)
         .send({});

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Missing snapshot or fileId");
   });
});
