import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Request, Response, NextFunction } from "express";

jest.mock("@clerk/express", () => ({
   clerkMiddleware: () => (_req: any, _res: any, next: any) => next(),
   verifyToken: jest.fn(),
}));

import userMiddleware from "../middlewares/auth.middleware";
import * as clerkExpress from "@clerk/express";

const mockVerifyToken = clerkExpress.verifyToken as jest.MockedFunction<
   typeof clerkExpress.verifyToken
>;

describe("Auth Middleware", () => {
   const mockNext: NextFunction = jest.fn();
   const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
   } as unknown as Response;

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("should return 401 when no authorization header is provided", async () => {
      const mockReq = {
         headers: {},
      } as unknown as Request;

      await userMiddleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
         expect.objectContaining({
            message: "Authorization token is required",
            statusCode: 401,
         }),
      );
      expect(mockNext).not.toHaveBeenCalled();
   });

   it("should attach userId and call next for a valid token", async () => {
      const mockReq = {
         headers: { authorization: "Bearer valid-token-123" },
      } as unknown as Request;

      mockVerifyToken.mockResolvedValue({
         sub: "user_abc123",
      } as any);

      await userMiddleware(mockReq, mockRes, mockNext);
      // Flush microtask queue so the async handler completes
      await Promise.resolve();

      expect((mockReq as any).userId).toBe("user_abc123");
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
   });

   it("should return 401 when token verification fails", async () => {
      const mockReq = {
         headers: { authorization: "Bearer invalid-token" },
      } as unknown as Request;

      mockVerifyToken.mockRejectedValue(new Error("Token expired"));

      await userMiddleware(mockReq, mockRes, mockNext);
      // Flush microtask so the catch block inside the middleware runs
      await Promise.resolve();

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
         expect.objectContaining({ message: "token is not valid" }),
      );
      expect(mockNext).not.toHaveBeenCalled();
   });
});
