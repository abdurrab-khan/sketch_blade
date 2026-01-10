import React, { useState } from "react";
import { useSelector } from "react-redux";

import { Row } from "@tanstack/react-table";
import { RootState } from "@/redux/store";

import { File, FolderDetails } from "@/types/file";

import { MdDelete } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { GrPowerReset } from "react-icons/gr";

import { Button } from "@/components/ui/button.tsx";
import Recover from "@/components/dialogs/Recover.tsx";
import DeleteFile from "@/components/dialogs/PermanentDeleteFile.tsx";
import DeleteFolder from "@/components/dialogs/PermanentDeleteFolder.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface IExtendedFile extends File {
  type: "file" | "folder";
}

interface IExtendedFolder extends FolderDetails {
  type: "file" | "folder";
}

interface TrashActionProps {
  row: Row<IExtendedFile | IExtendedFolder>;
}

function TrashAction({ row }: TrashActionProps) {
  const _id = row.original?._id;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recoverDialogOpen, setRecoverDialogOpen] = useState(false);

  return (
    <React.Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger title="Actions" asChild>
          <Button
            variant="none"
            className="text-zinc-700 hover:text-zinc-700/50 dark:text-slate-400 dark:hover:text-blue-400"
          >
            <BsThreeDots />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Trash Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setRecoverDialogOpen(true)}>
              <GrPowerReset className="h-4 w-4" />
              Recover
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setDeleteDialogOpen(true)} className={"w-full"}>
              <MdDelete className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {row.original.type === "file" ? (
        <DeleteFile id={_id} isOpen={deleteDialogOpen} setIsOpen={setDeleteDialogOpen} />
      ) : (
        <DeleteFolder id={_id} isOpen={deleteDialogOpen} setIsOpen={setDeleteDialogOpen} />
      )}

      <Recover
        id={_id}
        type={row.original.type}
        isOpen={recoverDialogOpen}
        setIsOpen={setRecoverDialogOpen}
      />
    </React.Fragment>
  );
}

export default TrashAction;
