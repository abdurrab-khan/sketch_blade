import { useCallback, useMemo } from "react";
import { useSync } from "@tldraw/sync";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { io } from "socket.io-client";
import { Tldraw } from "tldraw";
import { Loader2 } from "lucide-react";

import { FileData } from "@/types/file";
import { getRandomColor } from "@/utils/AppUtils";
import { socketIoToTldrawSocket, multiplayerAssets } from "@/utils/socket";

import "tldraw/tldraw.css";
import ActivityFeed from "./whitboard/ActivityFeed";
import Components from "./ui-zone/components";
import StoreSnapshot from "./whitboard/StoreSnapshot";
import useTheme from "@/hooks/use-theme";

interface IWhiteboardProps {
  id: string;
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

function Whiteboard({ id, file, token }: IWhiteboardProps) {
  const isDarkMode = useTheme();
  const auth = useSelector((root: RootState) => root.auth);

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
        });
        return socketIoToTldrawSocket(socket);
      },
      [id, token],
    ),
    assets: multiplayerAssets, // handled assets like image, videos
    userInfo: {
      id: auth._id,
      name: auth.name,
      color: getRandomColor(),
    },
  });
  const customComponents = useMemo(() => Components(file.role, id), [file.role, id]);

  if (store.status === "error") {
    return (
      <section className="flex-center text-quaternary fixed inset-0 size-full px-4 text-center">
        Failed to sync this file. Please refresh and try again.
      </section>
    );
  }

  // Keep showing a loader until sync store is ready.
  if (store.status !== "synced-remote") {
    return (
      <section className="flex-center text-quaternary fixed inset-0 size-full">
        <Loader2 size={48} className="animate-spin" />
      </section>
    );
  }

  return (
    <section className="fixed inset-0 size-full">
      <Tldraw
        className="tldraw__editor"
        store={store.store}
        components={customComponents}
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
