import { TLStore, useToasts } from "tldraw";

interface IActivityFeed {
  store: TLStore;
}

function ActivityFeed({ store }: IActivityFeed) {
  const { addToast } = useToasts();

  // Handle to listen user join/leave
  store?.listen(
    (changes) => {
      const changedRecord = changes.changes;
      const addedKeys = Object.keys(changedRecord.added);
      const removedKeys = Object.keys(changedRecord.removed);

      if (addedKeys.length > 0) {
        addedKeys.forEach((k) => {
          if (!(k in changedRecord.added)) return;

          const { userName } = changedRecord.added[k];

          addToast({
            title: `${userName} joined the room.`,
            severity: "success",
          });
        });
      }

      if (removedKeys.length > 0) {
        removedKeys.forEach((k) => {
          if (!(k in changedRecord.removed)) return;

          const { userName } = changedRecord.removed[k];

          addToast({
            title: `${userName} left the room`,
            severity: "success",
          });
        });
      }
    },
    {
      scope: "presence",
      source: "remote",
    },
  );

  return <></>;
}

export default ActivityFeed;
