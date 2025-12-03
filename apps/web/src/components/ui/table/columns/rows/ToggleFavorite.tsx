import React, { useState, useMemo } from "react";
import { debounce } from "lodash";
import useMutate from "@/hooks/useMutate";

import { FaRegStar, FaStar } from "react-icons/fa6";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface ToggleFavoriteProps {
  fileId: string;
  isFavorite: boolean;
  setOpen: React.Dispatch<React.SetState<boolean>>;
}

function ToggleFavorite({ fileId, isFavorite, setOpen }: ToggleFavoriteProps) {
  const [favorite, setFavorite] = useState<boolean>(isFavorite);

  const mutation = useMutate({
    finallyFn: () => setOpen(false),
    options: { queryKeys: ["getFavoriteFiles"] },
  });

  const toggleFavorite = useMemo(
    () =>
      debounce(() => {
        mutation.mutate({
          uri: `/file/toggle-favorite/${fileId}`,
          method: "post",
        });
      }, 800),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fileId],
  );

  const handleToggleFavorite = (e) => {
    e.preventDefault();

    // Change ui as clicked
    setFavorite((prev) => !prev);
    toggleFavorite();
  };

  return (
    <DropdownMenuItem onSelect={handleToggleFavorite} className={"w-full"}>
      {favorite ? <FaStar className="h-4 w-4" /> : <FaRegStar className="h-4 w-4" />}
      Favorite
    </DropdownMenuItem>
  );
}

export default ToggleFavorite;
