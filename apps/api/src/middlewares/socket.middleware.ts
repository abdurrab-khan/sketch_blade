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
      const { accessToken } = socket.handshake.query;

      if (!accessToken || typeof accessToken !== "string") {
         console.log("Missing required accessToken, disconnecting:", socket.id);
         socket.disconnect();
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
      socket.disconnect();
   }
};

export default socketMiddleware;
