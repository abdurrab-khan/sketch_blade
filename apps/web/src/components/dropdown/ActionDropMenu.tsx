import React from "react";
import { BsThreeDots } from "react-icons/bs";
import { Button } from "../ui/button";
import DropdownLayout from "./DropdownLayout";

interface ActionDropMenuProps {
  children: React.ReactNode;
}

function ActionDropMenu({ children }: ActionDropMenuProps) {
  return (
    <DropdownLayout
      trigger={
        <Button
          variant="none"
          className="text-zinc-700 hover:text-zinc-700/50 dark:text-slate-400 dark:hover:text-blue-400"
        >
          <BsThreeDots />
        </Button>
      }
      triggerTitle="Actions"
    >
      {children}
    </DropdownLayout>
  );
}

export default ActionDropMenu;
