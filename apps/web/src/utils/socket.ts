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
        // console.log("📥 Received:", message);
        callback(message);
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

  const disconnectHandler = () => {
    tldrawSocket.connectionStatus = "offline";
    statusChangeListeners.forEach((cb) => cb({ status: "offline" }));
  };

  const errorHandler = (error: any) => {
    console.error("❌ Error is going on: ", error);
    tldrawSocket.connectionStatus = "error";
    statusChangeListeners.forEach((cb) =>
      cb({
        status: "error",
        reason: error.message || "Connection error",
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

// How does our server handle bookmark unfurling?
// async function unfurlBookmarkUrl({ url }: { url: string }): Promise<TLBookmarkAsset> {
//   const asset: TLBookmarkAsset = {
//     id: AssetRecordType.createId(getHashForString(url)),
//     typeName: "asset",
//     type: "bookmark",
//     meta: {},
//     props: {
//       src: url,
//       description: "",
//       image: "",
//       favicon: "",
//       title: "",
//     },
//   };
//
//   try {
//     const response = await fetch(`${API_URL}/unfurl?url=${encodeURIComponent(url)}`);
//     const data = await response.json();
//
//     asset.props.description = data?.description ?? "";
//     asset.props.image = data?.image ?? "";
//     asset.props.favicon = data?.favicon ?? "";
//     asset.props.title = data?.title ?? "";
//   } catch (e) {
//     console.error(e);
//   }
//
//   return asset;
// }

export { multiplayerAssets, socketIoToTldrawSocket };
