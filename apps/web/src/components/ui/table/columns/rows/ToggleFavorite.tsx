import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface ToggleFavoriteProps {
  isFavorite: boolean;
}

function ToggleFavorite({ isFavorite }: ToggleFavoriteProps) {
  const [favorite, setFavorite] = useState(isFavorite);

  return (
    <DropdownMenuItem className={"w-full"}>
      {isFavorite ? <FaStar className="h-4 w-4" /> : <FaRegStar className="h-4 w-4" />}
      Favorite
    </DropdownMenuItem>
  );
}

export default ToggleFavorite;
