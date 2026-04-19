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
let createdFolderId: string;

beforeAll(async () => {
   mongoServer = await MongoMemoryServer.create();
   await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
   await mongoose.disconnect();
   await mongoServer.stop();
});

describe("Folder API", () => {
   it("POST /v1/folder - should create a folder with 201", async () => {
      const res = await request(app)
         .post("/v1/folder")
         .send({ folderName: "Work Projects" });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe("Work Projects");
      createdFolderId = res.body.data._id;
   });

   it("GET /v1/folder - should return folders list with 200", async () => {
      const res = await request(app).get("/v1/folder");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
   });

   it("PUT /v1/folder/:folderId - should update folder name", async () => {
      const res = await request(app)
         .put(`/v1/folder/${createdFolderId}`)
         .send({ folderName: "Updated Name" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Folder updated successfully");
   });

   it("DELETE /v1/folder/:folderId - should delete the folder", async () => {
      const res = await request(app).delete(`/v1/folder/${createdFolderId}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Folder deleted successfully");
   });
});
