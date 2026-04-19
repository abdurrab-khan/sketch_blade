import { describe, it, expect, beforeAll, afterAll, jest } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../server";

// Bypass auth middleware for integration tests
jest.mock(
   "../middlewares/auth.middleware",
   () => (_req: any, _res: any, next: any) => {
      _req.userId = "test_user_id";
      next();
   },
);

// Bypass Clerk middleware
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

describe("File API - POST /v1/file", () => {
   it("should create a new file and return 201", async () => {
      const res = await request(app).post("/v1/file").send({
         fileName: "My Test Diagram",
         description: "A test description",
      });

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty("_id");
      expect(res.body.data.name).toBe("My Test Diagram");
      expect(res.body.message).toBe("File created successfully");
   });

   it("should create a file with default name when fileName is not provided", async () => {
      const res = await request(app)
         .post("/v1/file")
         .send({ description: "No explicit name" });

      // createFileSchema defaults fileName to 'Untitled File', so 201 expected
      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty("_id");
   });

   it("should return 400 if fileName exceeds max length", async () => {
      const res = await request(app)
         .post("/v1/file")
         .send({ fileName: "A".repeat(256) });

      expect(res.status).toBe(400);
   });

   it("should create multiple files for the same user", async () => {
      await request(app).post("/v1/file").send({ fileName: "File Alpha" });
      const res = await request(app)
         .post("/v1/file")
         .send({ fileName: "File Beta" });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe("File Beta");
   });
});

describe("File API - GET /v1/file", () => {
   it("should return list of files with 200", async () => {
      const res = await request(app).get("/v1/file");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
   });
});
