import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Row } from "@tanstack/react-table";
import { RootState } from "@/redux/store.ts";

import type { File } from "@/types/file";

import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { FolderOpen, Move, Share2 } from "lucide-react";

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
import Share from "@/components/dialogs/Share.tsx";
import { DialogTrigger } from "@radix-ui/react-dialog";

interface FileActionProps {
  row: Row<File>;
}

function FileAction({ row }: FileActionProps) {
  const { _id, name, description, owner, folder } = row.original;

  const [open, setOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editFileDialogOpen, setEditFileDialogOpen] = useState(false);
  const [moveFileDialogOpen, setMoveFileDialogOpen] = useState(false);
  const { email } = useSelector((state: RootState) => state.auth);

  // For enabling owner only features
  const isOwner = owner.email === email;

  return (
    <React.Fragment>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger title="Actions" asChild>
          <Button variant="none" className="text-zinc-700 hover:text-zinc-700/50">
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
            <DropdownMenuItem onSelect={() => setEditFileDialogOpen(true)} className={"w-full"}>
              <FaEdit className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <ToggleFavorite
              isFavorite={row.original?.isFavorite}
              fileId={row.original._id}
              setOpen={setOpen}
            />
            {isOwner ? (
              <>
                <ToggleLock
                  isLocked={row.original?.isLocked}
                  fileId={row.original._id}
                  setOpen={setOpen}
                />
              </>
            ) : null}
            <DropdownMenuItem onSelect={() => setDeleteDialogOpen(true)}>
              <MdDelete className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
            {!folder && (
              <DropdownMenuItem onSelect={() => setMoveFileDialogOpen(true)} className={"w-full"}>
                <Move className="h-4 w-4" />
                Move File
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteFile id={_id} isOpen={deleteDialogOpen} setIsOpen={setDeleteDialogOpen} />
      <UpdateFile
        isOpen={editFileDialogOpen}
        setIsOpen={setEditFileDialogOpen}
        fileData={{ _id, name, description }}
      />
      {!folder && (
        <MoveFileDialog
          _id={_id}
          existingFolderId={row.original?.folder?._id}
          isOpen={moveFileDialogOpen}
          setIsOpen={setMoveFileDialogOpen}
        />
      )}
    </React.Fragment>
  );
}

export default FileAction;
