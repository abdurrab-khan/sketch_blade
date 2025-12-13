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
import ToggleLock from "./ToggleLock.tsx";
import { Button } from "@/components/ui/button";
import { BsThreeDots } from "react-icons/bs";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import DeleteFile from "@/components/dialogs/Trashfile.tsx";
import FileForm from "@/components/dialogs/Fileform";
import MoveFileDialog from "@/components/dialogs/Movefile";
import { RootState } from "@/redux/store.ts";

interface FileActionProps {
  row: Row<File>;
}

function FileAction({ row }: FileActionProps) {
  const { _id, name, description, owner } = row.original;

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
        <DropdownMenuTrigger title="Role" asChild>
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
            <DropdownMenuItem onSelect={() => setMoveFileDialogOpen(true)} className={"w-full"}>
              <Move className="h-4 w-4" />
              Move File
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteFile id={_id} isOpen={deleteDialogOpen} setIsOpen={setDeleteDialogOpen} />
      <FileForm
        _id={_id}
        isOpen={editFileDialogOpen}
        setIsOpen={setEditFileDialogOpen}
        fileData={{ name, description }}
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
