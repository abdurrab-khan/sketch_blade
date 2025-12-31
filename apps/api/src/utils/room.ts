import { mkdirSync } from "fs";
import { RoomSnapshot, TLSocketRoom } from "@tldraw/sync-core";

const DIR = "./.rooms";
mkdirSync(DIR, { recursive: true });

// Sanitize roomId to prevent path traversal attacks
function sanitizeRoomId(roomId: string): string {
   return roomId.replace(/[^a-zA-Z0-9_-]/g, "_");
}

// We'll keep an in-memory map of active rooms
const rooms = new Map<string, TLSocketRoom<any, void>>();

export function makeOrLoadRoom(
   roomId: string,
   document?: any,
): TLSocketRoom<any, void> {
   roomId = sanitizeRoomId(roomId);

   const existing = rooms.get(roomId);
   if (existing && !existing.isClosed()) {
      return existing;
   }

   const room = new TLSocketRoom({
      initialSnapshot: document as unknown as RoomSnapshot,
      onSessionRemoved(room, args) {
         console.log("client disconnected", args.sessionId, roomId);
         if (args.numSessionsRemaining === 0) {
            console.log("closing room", roomId);
            room.close();
            rooms.delete(roomId);
         }
      },
   });

   rooms.set(roomId, room);
   return room;
}

export default makeOrLoadRoom;
