import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Request, Response, NextFunction } from "express";
import {
   addCollaborator,
   removeCollaborator,
} from "../controllers/collaborator.controller";

// Controlled manual mocks for Mongoose model methods
const mockUserFindOne = jest.fn();
const mockCollaboratorInsertOne = jest.fn();
const mockCollaboratorFindByIdAndDelete = jest.fn();

jest.mock("../models", () => ({
   User: {
      findOne: (...args: any[]) => mockUserFindOne(...args),
   },
   Collaborator: {
      insertOne: (...args: any[]) => mockCollaboratorInsertOne(...args),
      findByIdAndDelete: (...args: any[]) =>
         mockCollaboratorFindByIdAndDelete(...args),
      aggregate: jest.fn(),
   },
}));

jest.mock("../types/zod/zodParserHelper", () =>
   jest.fn(() => ({ email: "test@example.com", role: "edit" })),
);

describe("Collaborator Controller", () => {
   const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
   } as unknown as Response;

   beforeEach(() => jest.clearAllMocks());

   describe("addCollaborator", () => {
      it("should call next with 400 error if user is not the file owner", async () => {
         const mockReq = {
            file: { isOwner: false },
            body: { email: "test@example.com", role: "edit" },
         } as unknown as Request;

         const mockNext: NextFunction = jest.fn();
         addCollaborator(mockReq, mockRes, mockNext);
         await Promise.resolve();
         await Promise.resolve();

         expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining({
               message: "You are not authorized to add collaborators",
            }),
         );
      });

      it("should call next with 400 error if user email does not exist", async () => {
         const mockReq = {
            file: { _id: "file_abc", isOwner: true },
            body: { email: "nobody@example.com", role: "view" },
         } as unknown as Request;

         mockUserFindOne.mockReturnValue({
            lean: jest.fn().mockResolvedValue(null),
         });

         const mockNext: NextFunction = jest.fn();
         addCollaborator(mockReq, mockRes, mockNext);
         await Promise.resolve();
         await Promise.resolve();
         await Promise.resolve();

         expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining({
               message: "User with email test@example.com does not exist",
            }),
         );
      });

      it("should successfully add a collaborator and return 200", async () => {
         const mockReq = {
            file: { _id: "file_abc", isOwner: true },
            body: { email: "test@example.com", role: "edit" },
         } as unknown as Request;

         const mockUser = {
            clerkId: "user_xyz",
            email: "test@example.com",
            firstName: "John",
            lastName: "Doe",
            profileUrl: "",
         };

         mockUserFindOne.mockReturnValue({
            lean: jest.fn().mockResolvedValue(mockUser),
         });

         mockCollaboratorInsertOne.mockResolvedValue({
            _id: "collab_1",
            role: "edit",
         });

         addCollaborator(mockReq, mockRes, jest.fn());
         await Promise.resolve();
         await Promise.resolve();
         await Promise.resolve();

         expect(mockCollaboratorInsertOne).toHaveBeenCalledWith(
            expect.objectContaining({
               fileId: "file_abc",
               userId: "user_xyz",
               role: "edit",
            }),
         );
         expect(mockRes.status).toHaveBeenCalledWith(200);
      });
   });

   describe("removeCollaborator", () => {
      it("should call next with 400 error if user is not the file owner", async () => {
         // Override the zodParserHelper mock for removeCollaborator
         const zodParserHelper = require("../types/zod/zodParserHelper");
         (zodParserHelper as jest.Mock).mockReturnValueOnce({
            collaboratorId: "collab_123",
         });

         const mockReq = {
            file: { isOwner: false },
            body: { collaboratorId: "collab_123" },
         } as unknown as Request;

         const mockNext: NextFunction = jest.fn();
         removeCollaborator(mockReq, mockRes, mockNext);
         await Promise.resolve();
         await Promise.resolve();

         expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining({
               message: "User is not authorized to remove collaborators",
            }),
         );
      });
   });
});
