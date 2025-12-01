import React, { useState } from "react";
import type { File } from "@/types/file";
import { Row } from "@tanstack/react-table";
import { FolderOpen, Move } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import ToggleFavorite from "./ToggleFavorite.tsx";
import { Button } from "@/components/ui/button";
import { BsThreeDots } from "react-icons/bs";
import { FaLock, FaUnlock } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import FileDeleteDialog from "@/components/dialogs/FileDeleteDialog";
import FileForm from "@/components/dialogs/FileFormDialog";
import MoveFileDialog from "@/components/dialogs/MoveFileDialog";

interface FileActionProps {
  row: Row<File>;
}

function FileAction({ row }: FileActionProps) {
  const { _id, name, description, collaborators } = row.original;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editFileDialogOpen, setEditFileDialogOpen] = useState(false);
  const [moveFileDialogOpen, setMoveFileDialogOpen] = useState(false);
  const { email } = useSelector((state: RootState) => state.auth);

  // For enabling owner only features
  const isOwner = row.original?.owner.email === email;

  return (
    <React.Fragment>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger title="Actions" asChild>
          <Button variant="none" className="text-zinc-700 hover:text-zinc-700/50">
            <BsThreeDots />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <FolderOpen className="h-4 w-4" />
              Open
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setEditFileDialogOpen(true)} className={"w-full"}>
              <FaEdit className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <ToggleFavorite isFavorite={row.original?.isFavorite} />
            {isOwner ? (
              <>
                <DropdownMenuItem>
                  {row.original.isLocked ? (
                    <>
                      <FaUnlock className="h-4 w-4" />
                      Unlock
                    </>
                  ) : (
                    <>
                      <FaLock className="h-4 w-4" />
                      Lock
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setDeleteDialogOpen(true)}>
                  <MdDelete className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </>
            ) : null}
            <DropdownMenuItem onSelect={() => setMoveFileDialogOpen(true)} className={"w-full"}>
              <Move className="h-4 w-4" />
              Move File
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <FileDeleteDialog id={_id} isOpen={deleteDialogOpen} setIsOpen={setDeleteDialogOpen} />
      <FileForm
        _id={_id}
        isOpen={editFileDialogOpen}
        setIsOpen={setEditFileDialogOpen}
        fileData={{ name, description, collaborators }}
      />
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
