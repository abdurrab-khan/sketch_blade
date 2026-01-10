import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Row } from "@tanstack/react-table";
import { RootState } from "@/redux/store.ts";

import type { File } from "@/types/file";

import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { FolderOpen, Move } from "lucide-react";

import ToggleLock from "./ToggleLock.tsx";
import ToggleFavorite from "./ToggleFavorite.tsx";

import { Button } from "@/components/ui/button";
import MoveFileDialog from "@/components/dialogs/Movefile";
import DeleteFile from "@/components/dialogs/Trashfile.tsx";
import UpdateFile from "@/components/dialogs/Updatefile.tsx";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { FaUsers } from "react-icons/fa6";
import HandleCollaborators from "@/components/dialogs/HandleCollaborators.tsx";

interface FileActionProps {
  row: Row<File>;
}

function FileAction({ row }: FileActionProps) {
  const { _id, owner, folder } = row.original;

  const [open, setOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editFileDialogOpen, setEditFileDialogOpen] = useState(false);
  const [moveFileDialogOpen, setMoveFileDialogOpen] = useState(false);
  const [collaboratorsDialogOpen, setCollaboratorsDialogOpen] = useState(false);
  const { email } = useSelector((state: RootState) => state.auth);

  // For enabling owner only features
  const isOwner = owner.email === email;

  return (
    <React.Fragment>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger title="Actions" asChild>
          <Button
            variant="none"
            className="text-zinc-700 hover:text-zinc-700/50 dark:text-slate-400 dark:hover:text-blue-400"
          >
            <BsThreeDots />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>File Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <FolderOpen className="h-4 w-4" />
              Open
            </DropdownMenuItem>

            {/* Only owner can edit, lock, handle collaborators the file */}
            {isOwner && (
              <React.Fragment>
                <DropdownMenuItem onSelect={() => setEditFileDialogOpen(true)} className={"w-full"}>
                  <FaEdit className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setCollaboratorsDialogOpen(true)}>
                  <FaUsers />
                  Collaborators
                </DropdownMenuItem>
                <ToggleLock
                  isLocked={row.original?.isLocked}
                  fileId={row.original._id}
                  setOpen={setOpen}
                />
              </React.Fragment>
            )}

            <ToggleFavorite
              isFavorite={row.original?.isFavorite}
              fileId={row.original._id}
              setOpen={setOpen}
            />
            <DropdownMenuItem onSelect={() => setDeleteDialogOpen(true)}>
              <MdDelete className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setMoveFileDialogOpen(true)} className={"w-full"}>
              <Move className="h-4 w-4" />
              {folder ? "Change Folder" : "Move to Folder"}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteFile id={_id} isOpen={deleteDialogOpen} setIsOpen={setDeleteDialogOpen} />

      {/* Only owners can update, handle collaborators */}
      {isOwner && (
        <React.Fragment>
          <UpdateFile
            isOpen={editFileDialogOpen}
            setIsOpen={setEditFileDialogOpen}
            fileData={row.original}
          />
          <HandleCollaborators
            isOpen={collaboratorsDialogOpen}
            fileId={row.original._id}
            setIsOpen={setCollaboratorsDialogOpen}
          />
        </React.Fragment>
      )}

      <MoveFileDialog
        _id={_id}
        existingFolderId={row.original?.folder?._id}
        isOpen={moveFileDialogOpen}
        setIsOpen={setMoveFileDialogOpen}
      />
    </React.Fragment>
  );
}

export default FileAction;
