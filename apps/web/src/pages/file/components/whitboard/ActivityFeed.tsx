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
          const typedKey = k as keyof typeof changedRecord.added;
          const addedRecord = changedRecord.added[typedKey];
          if (!addedRecord) return;

          const { userName } = addedRecord as { userName?: string };

          addToast({
            title: `${userName} joined the room.`,
            severity: "success",
          });
        });
      }

      if (removedKeys.length > 0) {
        removedKeys.forEach((k) => {
          const typedKey = k as keyof typeof changedRecord.removed;
          const removedRecord = changedRecord.removed[typedKey];
          if (!removedRecord) return;

          const { userName } = removedRecord as { userName?: string };

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
