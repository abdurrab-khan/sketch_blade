import { describe, it, expect, beforeAll, afterAll, jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../server";
import { File, User } from "../models";

jest.mock(
   "../middlewares/auth.middleware",
   () => (_req: any, _res: any, next: any) => {
      _req.userId = "owner_clerk_id";
      next();
   },
);

jest.mock("@clerk/express", () => ({
   clerkMiddleware: () => (_req: any, _res: any, next: any) => next(),
   verifyToken: jest.fn(),
}));

let mongoServer: MongoMemoryServer;
let testFileId: string;

beforeAll(async () => {
   mongoServer = await MongoMemoryServer.create();
   await mongoose.connect(mongoServer.getUri());

   const file = await File.create({
      name: "Test File",
      ownerId: "owner_clerk_id",
   });
   testFileId = file._id.toString();

   await User.create({
      clerkId: "collab_clerk_id",
      email: "collab@test.com",
      firstName: "Collab",
      lastName: "User",
   });
});

afterAll(async () => {
   await mongoose.disconnect();
   await mongoServer.stop();
});

describe("Collaborator API", () => {
   it("GET /v1/collaborator/:fileId - should return empty array initially", async () => {
      const res = await request(app).get(`/v1/collaborator/${testFileId}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
   });

   it("POST /v1/collaborator/:fileId - should add a collaborator", async () => {
      const res = await request(app)
         .post(`/v1/collaborator/${testFileId}`)
         .send({ email: "collab@test.com", role: "edit" });

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe("collab@test.com");
      expect(res.body.data.role).toBe("edit");
   });

   it("GET /v1/collaborator/:fileId - should return collaborator after adding", async () => {
      const res = await request(app).get(`/v1/collaborator/${testFileId}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].email).toBe("collab@test.com");
   });
});
