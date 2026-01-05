import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Row } from "@tanstack/react-table";

import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { AiFillFolderOpen } from "react-icons/ai";

import type { FolderDetails } from "@/types/file";

import { Button } from "@/components/ui/button";
import Folderform from "@/components/dialogs/Folderform";
import Deletefolder from "@/components/dialogs/Trashfolder";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface FolderActionProps {
  row: Row<FolderDetails>;
}

const FolderAction = ({ row }: FolderActionProps) => {
  const { _id, name } = row.original;

  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const { email } = useSelector((state: RootState) => state.auth);

  // For enabling owner only features
  const isOwner = row.original?.owner.email === email;

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
          <DropdownMenuLabel>Folder Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <AiFillFolderOpen className="inline h-4 w-4" />
              <span className="inline">Open</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setEditDialog(true)} className={"w-full"}>
              <FaEdit className={"h-4 w-4"} />
              Edit
            </DropdownMenuItem>
            {isOwner ? (
              <DropdownMenuItem onSelect={() => setDeleteDialog(true)}>
                <MdDelete className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Deletefolder id={_id} isOpen={deleteDialog} setIsOpen={setDeleteDialog} />
      <Folderform _id={_id} isOpen={editDialog} setIsOpen={setEditDialog} folderData={{ name }} />
    </React.Fragment>
  );
};

export default FolderAction;
