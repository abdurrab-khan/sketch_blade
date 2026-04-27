import { useCallback, useMemo } from "react";
import { useSync } from "@tldraw/sync";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { io } from "socket.io-client";
import { Tldraw } from "tldraw";

import { FileData } from "@/types/file";
import { getRandomColor } from "@/utils/AppUtils";
import { socketIoToTldrawSocket, multiplayerAssets } from "@/utils/socket";

import "tldraw/tldraw.css";
import ActivityFeed from "./whitboard/ActivityFeed";
import Components from "./ui-zone/components";
import StoreSnapshot from "./whitboard/StoreSnapshot";

import SyncStateScreen from "./SyncStateScreen";
import { Loader2 } from "lucide-react";

interface IWhiteboardProps {
  id: string;
  isDarkMode: boolean;
  file: FileData;
  token: string;
}

const getSocketServerUrl = () => {
  const socketUrl = import.meta.env["VITE_SOCKET_URL"];
  if (socketUrl) {
    return socketUrl;
  }

  const apiUrl = import.meta.env["VITE_API_URL"];
  if (!apiUrl) {
    if (import.meta.env.DEV) {
      return "http://localhost:8080";
    }

    return undefined;
  }

  try {
    return new URL(apiUrl).origin;
  } catch {
    return apiUrl;
  }
};

function Whiteboard({ id, file, token, isDarkMode }: IWhiteboardProps) {
  const auth = useSelector((root: RootState) => root.auth);
  const retrySync = () => window.location.reload();

  const store = useSync({
    connect: useCallback(
      (query) => {
        const socket = io(getSocketServerUrl(), {
          path: "/socket.io",
          transports: ["polling", "websocket"],
          auth: {
            accessToken: token,
          },
          query: {
            ...query,
            fileId: id,
            roomId: `room-${id}`,
          },
          reconnection: true,
        });
        return socketIoToTldrawSocket(socket);
      },
      [id, token],
    ),
    assets: multiplayerAssets,
    userInfo: {
      id: auth._id,
      name: auth.name,
      color: getRandomColor(),
    },
  });

  if (store.status === "error") {
    return (
      <SyncStateScreen
        fileName={file.name}
        isDarkMode={isDarkMode}
        state="error"
        onRetry={retrySync}
      />
    );
  }

  if (store.status !== "synced-remote") {
    return (
      <div className={"size-screen flex-center bg-primary dark:bg-primary-bg-dark dark:text-white"}>
        <Loader2 size={48} className={"text-quaternary animate-spin"} />
      </div>
    );
  }

  console.log("Filestore synced with remote:", file);

  return (
    <section className="fixed inset-0 size-full">
      <Tldraw
        className="tldraw__editor"
        store={store.store}
        components={Components(file.role, id)}
        onMount={(editor) => {
          editor.user.updateUserPreferences({
            colorScheme: isDarkMode ? "dark" : "light",
          });
        }}
      >
        <ActivityFeed store={store.store} />
        <StoreSnapshot store={store.store} fileId={id} />
      </Tldraw>
    </section>
  );
}

export default Whiteboard;
