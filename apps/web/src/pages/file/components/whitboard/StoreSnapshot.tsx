import useApiClient from "@/hooks/useApiClient";
import { throttle } from "lodash";
import { TLStore, getSnapshot } from "tldraw";

interface IStoreSnapshotProps {
  store: TLStore;
  fileId: string;
}

function StoreSnapshot({ store, fileId }: IStoreSnapshotProps) {
  const apiClient = useApiClient();

  const saveSnapshot = throttle((snapshot: any) => {
    apiClient.post(`/canvas/save/${fileId}`, { snapshot });
  }, 5000);

  store.listen(
    () => {
      const snapshot = getSnapshot(store);
      saveSnapshot(snapshot);
    },
    {
      source: "user",
      scope: "document",
    },
  );

  return <></>;
}

export default StoreSnapshot;
