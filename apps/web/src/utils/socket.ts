import { TLPersistentClientSocket, TLSocketStatusChangeEvent } from "@tldraw/sync";
import { Socket } from "socket.io-client";
import { TLRecord, TLAssetStore, uniqueId } from "tldraw";

const API_URL = import.meta.env["VITE_API_URL"];

// Convert Socket.IO to TLPersistentClientSocket
function socketIoToTldrawSocket(ioSocket: Socket): TLPersistentClientSocket<TLRecord> {
  const statusChangeListeners = new Set<(event: TLSocketStatusChangeEvent) => void>();
  const tldrawSocket: TLPersistentClientSocket<TLRecord> = {
    connectionStatus: "offline",

    sendMessage: (message) => {
      // console.log("📤 Sending:", message);
      ioSocket.emit("tldraw-message", JSON.stringify(message));
    },

    onReceiveMessage: (callback) => {
      // Listen for tldraw sync protocol messages
      const handler = (message: any) => {
        try {
          const parsedMessage = typeof message === "string" ? JSON.parse(message) : message;
          callback(parsedMessage);
        } catch (error) {
          console.error("Failed to parse socket payload:", error);
        }
      };

      ioSocket.on("tldraw-message", handler);

      // Return cleanup function
      return () => {
        ioSocket.off("tldraw-message", handler);
      };
    },

    onStatusChange: (callback) => {
      statusChangeListeners.add(callback);
      return () => {
        statusChangeListeners.delete(callback);
      };
    },

    restart: () => {
      console.log("🔄 Restarting Socket.IO connection...");
      ioSocket.disconnect();
      ioSocket.connect();
    },

    close: () => {
      ioSocket.off("connect", connectHandler);
      ioSocket.off("disconnect", disconnectHandler);
      ioSocket.off("connect_error", errorHandler);
      clearTimeout(initialStatusTimeout);
      ioSocket.disconnect();
    },
  };

  // Map Socket.IO events to TLPersistentClientSocket status
  const connectHandler = () => {
    tldrawSocket.connectionStatus = "online";
    statusChangeListeners.forEach((cb) => cb({ status: "online" }));
  };

  const disconnectHandler = (reason?: string) => {
    if (reason === "io server disconnect") {
      tldrawSocket.connectionStatus = "error";
      statusChangeListeners.forEach((cb) =>
        cb({
          status: "error",
          reason: "Disconnected by server",
        }),
      );
      return;
    }

    tldrawSocket.connectionStatus = "offline";
    statusChangeListeners.forEach((cb) => cb({ status: "offline" }));
  };

  const errorHandler = (error: any) => {
    console.error("❌ Error is going on: ", error);
    tldrawSocket.connectionStatus = "error";
    statusChangeListeners.forEach((cb) =>
      cb({
        status: "error",
        reason: error?.message || error?.description || "Connection error",
      }),
    );
  };

  ioSocket.on("connect", connectHandler);
  ioSocket.on("disconnect", disconnectHandler);
  ioSocket.on("connect_error", errorHandler);

  // Set initial status
  const initialStatusTimeout = setTimeout(() => {
    if (ioSocket.connected) {
      tldrawSocket.connectionStatus = "online";
      statusChangeListeners.forEach((cb) => cb({ status: "online" }));
    }
  }, 0);

  return tldrawSocket;
}

// Handle assets like images and videos?
const multiplayerAssets: TLAssetStore = {
  async upload(_asset, file) {
    const id = uniqueId();

    const objectName = `${id}-${file.name}`;
    const url = `${API_URL}/uploads/${encodeURIComponent(objectName)}`;

    const response = await fetch(url, {
      method: "PUT",
      body: file,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload asset: ${response.statusText}`);
    }

    return { src: url };
  },
  // to retrieve an asset, we can just use the same URL. you could customize this to add extra
  // auth, or to serve optimized versions / sizes of the asset.
  resolve(asset) {
    return asset.props.src;
  },
};

export { multiplayerAssets, socketIoToTldrawSocket };
