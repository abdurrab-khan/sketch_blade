import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Row } from "@tanstack/react-table";
import FolderForm from "@/components/dialogs/FolderFormDialog";

import type { FolderDetails } from "@/types/file";
import { AiFillFolderOpen } from "react-icons/ai";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FolderDeleteDialog from "@/components/dialogs/FolderDeleteDialog";
import { Button } from "@/components/ui/button";
import { BsThreeDots } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

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
          <Button variant="none" className="text-zinc-700 hover:text-zinc-700/50">
            <BsThreeDots />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
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

      <FolderDeleteDialog id={_id} isOpen={deleteDialog} setIsOpen={setDeleteDialog} />
      <FolderForm _id={_id} isOpen={editDialog} setIsOpen={setEditDialog} folderData={{ name }} />
    </React.Fragment>
  );
};

export default FolderAction;
