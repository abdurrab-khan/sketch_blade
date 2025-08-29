import { Button } from "../ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.tsx";
import { BsThreeDots } from "react-icons/bs";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { AiFillFolderOpen } from "react-icons/ai";
import { Share2 } from "lucide-react";

interface ActionDropMenuProps {
  _id: string;
  children: React.ReactNode;
  type: "file" | "folder";
}

function ActionDropMenu({ _id, children, type }: ActionDropMenuProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const childrenArray = React.Children.toArray(children);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="none" className={"transition-all hover:text-tertiary"}>
          <BsThreeDots />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="dark-container w-40">
        <DropdownMenuItem onSelect={() => navigate(type === "folder" ? `${_id}` : `/file/${_id}`)}>
          <AiFillFolderOpen className="h-4 w-4" />
          Open
        </DropdownMenuItem>
        {childrenArray[0]}
        {childrenArray[1]}
        {childrenArray[2]}
        <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
          <Share2 className="h-4 w-4" />
          Share
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ActionDropMenu;
