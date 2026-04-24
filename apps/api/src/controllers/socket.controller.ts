import { socket } from "@/server";
import makeOrLoadRoom from "@/utils/room";
import { File, Collaborator, CanvasState } from "@/models";
import { WebSocketMinimal } from "@tldraw/sync-core";

socket.on("connection", async (socket) => {
   console.log("Socket.IO client connected:", socket.id);

   const userId = socket.userId;
   const roomId = socket.handshake.query.roomId as string;
   const fileId = socket.handshake.query.fileId as string;
   const sessionId = socket.handshake.query.sessionId as string;

   if (!(sessionId && roomId && fileId)) {
      console.log("Missing required parameters, disconnecting:", socket.id);
      socket.disconnect();
      return;
   }

   console.log("Connecting to room:", roomId, "with session:", sessionId);

   try {
      const file = await File.findById(fileId);
      const collaborator = await Collaborator.findOne({
         fileId,
         userId,
      }).lean();

      // If user is not a collaborator -- throw an error
      if (file?.ownerId !== userId && collaborator == null) {
         throw new Error("Unauthorized request");
      }

      // Initializing room with initial snapshot
      const state = await CanvasState.findOne({ fileId });
      const room = makeOrLoadRoom(
         roomId,
         state?.snapshot?.document ?? undefined,
      );

      // Create a socket adapter for TLSocketRoom
      const socketAdapter: WebSocketMinimal = {
         send: (message) => {
            socket.emit("tldraw-message", message);
         },
         close: () => {
            socket.disconnect();
         },
         get readyState() {
            return socket.connected ? 1 : 3; // 1 = OPEN, 3 = CLOSED
         },
      };

      // checking ready only
      const isReadonly =
         file?.ownerId !== userId && collaborator?.role === "view";

      // and finally connect the socket to the room
      room.handleSocketConnect({
         sessionId: sessionId,
         socket: socketAdapter,
         isReadonly,
      });

      // Handle tldraw sync messages
      socket.on("tldraw-message", (message) => {
         try {
            const payload =
               typeof message === "string" ? message : JSON.stringify(message);

            room.handleSocketMessage(sessionId, payload);
         } catch (error) {
            console.error("Error handling tldraw socket message:", error);
         }
      });

      // Handle disconnect
      socket.on("disconnect", () => {
         console.log("Socket.IO client disconnected:", socket.id);
      });
   } catch (error) {
      console.error("Error setting up room connection:", error);
      socket.disconnect();
   }
});
