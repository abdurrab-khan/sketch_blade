import React from "react";
import { BsThreeDots } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";

interface ActionDropMenuProps {
  children: React.ReactNode;
}

function ActionDropMenu({ children }: ActionDropMenuProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger title="Actions" asChild>
        <Button
          variant="none"
          className="text-zinc-700 hover:text-zinc-700/50 dark:text-slate-400 dark:hover:text-blue-400"
        >
          <BsThreeDots />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>{children}</DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ActionDropMenu;
