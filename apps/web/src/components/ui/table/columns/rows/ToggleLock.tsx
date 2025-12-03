import React, { useState, useMemo } from "react";
import { debounce } from "lodash";
import useMutate from "@/hooks/useMutate";
import { FaLock, FaUnlock } from "react-icons/fa6";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface ToggleLockProps {
  fileId: string;
  isLocked: boolean;
  setOpen: React.Dispatch<React.SetState<boolean>>;
}

function ToggleLock({ fileId, isLocked, setOpen }: ToggleLockProps) {
  const [locked, setLock] = useState(isLocked);

  const mutation = useMutate({
    finallyFn: () => setOpen(false),
    options: { queryKeys: ["getFiles"] },
  });

  const toggleLock = useMemo(
    () =>
      debounce(() => {
        mutation.mutate({
          uri: `/file/toggle-lock/${fileId}`,
          method: "post",
        });
      }, 800),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fileId],
  );

  const handleToggleLock = (e) => {
    e.preventDefault();

    // Change ui as clicked
    setLock((prev) => !prev);
    toggleLock();
  };

  return (
    <DropdownMenuItem onSelect={handleToggleLock} className={"w-full"}>
      {locked ? (
        <>
          <FaUnlock className="h-4 w-4" />
          Unlock
        </>
      ) : (
        <>
          <FaLock className="h-4 w-4" />
          Lock
        </>
      )}
    </DropdownMenuItem>
  );
}

export default ToggleLock;
