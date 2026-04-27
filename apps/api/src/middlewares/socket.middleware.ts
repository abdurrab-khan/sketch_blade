import type { Socket } from "socket.io";
import type { ClientToServerMessage, ServerToClientMessage } from "@/types";

import { verifyToken } from "@clerk/express";
import { DefaultEventsMap, ExtendedError } from "socket.io";

const socketMiddleware = async (
   socket: Socket<
      ClientToServerMessage,
      ServerToClientMessage,
      DefaultEventsMap,
      any
   >,
   next: (err?: ExtendedError) => void,
) => {
   try {
      const accessToken =
         (socket.handshake.auth as { accessToken?: string })?.accessToken ??
         socket.handshake.query.accessToken;

      if (!accessToken || typeof accessToken !== "string") {
         const error = new Error("Missing access token") as ExtendedError;
         error.data = { code: "UNAUTHORIZED" };
         next(error);
         return;
      }

      const session = await verifyToken(accessToken, {
         secretKey: process.env.CLERK_SECRET_KEY,
      });

      socket.userId = session.sub;
      next();
   } catch (error) {
      console.log(
         "Unexpected error occurred in socket middleware: ",
         (error as Error)?.message ?? error,
      );
      const authError = new Error(
         "Socket authentication failed",
      ) as ExtendedError;
      authError.data = {
         code: "UNAUTHORIZED",
         reason: (error as Error)?.message ?? "Authentication error",
      };
      next(authError);
   }
};

export default socketMiddleware;
