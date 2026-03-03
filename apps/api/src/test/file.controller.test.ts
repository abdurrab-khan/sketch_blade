import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Request, Response, NextFunction } from "express";
import { createFile } from "../controllers/file.controller";

const mockFileCreate = jest.fn();

jest.mock("../models", () => ({
   File: {
      create: (...args: any[]) => mockFileCreate(...args),
   },
   DeletedFile: {},
   FavoriteFile: {},
   Folder: {},
   FolderFileBridge: {},
   Collaborator: {},
   User: {},
}));

jest.mock("../types/zod/zodParserHelper", () =>
   jest.fn(() => ({
      fileName: "Test File",
      folderId: null,
      description: "Test desc",
   })),
);

describe("File Controller - createFile", () => {
   const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
   } as unknown as Response;

   beforeEach(() => jest.clearAllMocks());

   it("should create a file and return 201 with file data", async () => {
      const mockReq = {
         userId: "user_test123",
         body: { fileName: "Test File", description: "Test desc" },
      } as unknown as Request;

      const createdFile = {
         _id: "file_abc",
         name: "Test File",
         description: "Test desc",
         isLocked: false,
      };
      (mockFileCreate as jest.Mock).mockResolvedValue(createdFile);

      createFile(mockReq, mockRes, jest.fn());
      await Promise.resolve();
      await Promise.resolve();

      expect(mockFileCreate).toHaveBeenCalledWith(
         expect.objectContaining({
            name: "Test File",
            ownerId: "user_test123",
         }),
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
         expect.objectContaining({ message: "File created successfully" }),
      );
   });

   it("should call next with 500 error when file creation returns null", async () => {
      const mockReq = {
         userId: "user_test123",
         body: { fileName: "Test File" },
      } as unknown as Request;

      (mockFileCreate as jest.Mock).mockResolvedValue(null);

      const mockNext: NextFunction = jest.fn();
      createFile(mockReq, mockRes, mockNext);
      // Flush two microtask ticks: one for File.create resolution, one for catch(next)
      await Promise.resolve();
      await Promise.resolve();

      expect(mockNext).toHaveBeenCalledWith(
         expect.objectContaining({
            message: "File not created, please try again",
         }),
      );
   });

   it("should pass correct ownerId from req.userId when creating file", async () => {
      const mockReq = {
         userId: "owner_user_456",
         body: { fileName: "My Diagram" },
      } as unknown as Request;

      const createdFile = {
         _id: "file_xyz",
         name: "Test File",
         description: "Test desc",
         isLocked: false,
      };
      (mockFileCreate as jest.Mock).mockResolvedValue(createdFile);

      createFile(mockReq, mockRes, jest.fn());
      await Promise.resolve();
      await Promise.resolve();

      expect(mockFileCreate).toHaveBeenCalledWith(
         expect.objectContaining({ ownerId: "owner_user_456" }),
      );
   });

   it("should include file _id in the response data", async () => {
      const mockReq = {
         userId: "user_test123",
         body: { fileName: "Test File", description: "Test desc" },
      } as unknown as Request;

      const createdFile = {
         _id: "unique_file_id",
         name: "Test File",
         description: "Test desc",
         isLocked: false,
      };
      (mockFileCreate as jest.Mock).mockResolvedValue(createdFile);

      createFile(mockReq, mockRes, jest.fn());
      await Promise.resolve();
      await Promise.resolve();

      expect(mockRes.json).toHaveBeenCalledWith(
         expect.objectContaining({
            data: expect.objectContaining({ _id: "unique_file_id" }),
         }),
      );
   });

   it("should set isLocked to false on newly created file", async () => {
      const mockReq = {
         userId: "user_test123",
         body: { fileName: "Test File" },
      } as unknown as Request;

      const createdFile = {
         _id: "file_new",
         name: "Test File",
         description: undefined,
         isLocked: false,
      };
      (mockFileCreate as jest.Mock).mockResolvedValue(createdFile);

      createFile(mockReq, mockRes, jest.fn());
      await Promise.resolve();
      await Promise.resolve();

      expect(mockRes.json).toHaveBeenCalledWith(
         expect.objectContaining({
            data: expect.objectContaining({ isLocked: false }),
         }),
      );
   });
});
