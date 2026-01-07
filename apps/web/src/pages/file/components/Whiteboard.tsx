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
import useTheme from "@/hooks/useTheme";

interface IWhiteboardProps {
  id: string;
  file: FileData;
  token: string;
}

const SOCKET_URL = import.meta.env["VITE_SOCKET_URL"];

function Whiteboard({ id, file, token }: IWhiteboardProps) {
  const isDarkMode = useTheme();
  const auth = useSelector((root: RootState) => root.auth);
  const store = useSync({
    connect: useCallback(
      (query) => {
        const socket = io(SOCKET_URL, {
          query: { ...query, fileId: id, roomId: `room-${id}`, accessToken: token },
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

  // Return nothing if store is not there
  if (!store?.store) {
    return <></>;
  }

  return (
    <section className="fixed inset-0 size-full">
      <Tldraw
        className="tldraw__editor"
        store={store}
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
