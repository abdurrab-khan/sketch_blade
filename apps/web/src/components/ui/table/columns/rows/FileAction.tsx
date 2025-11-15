import { useState } from "react";
import { Move } from "lucide-react";
import { FaEdit } from "react-icons/fa";
import type { File } from "@/types/file";
import useMutate from "@/hooks/useMutate";
import { Row } from "@tanstack/react-table";
import FileForm from "@/components/dialogs/FileForm";
import DeleteDialog from "@/components/dialogs/DeleteDialog";
import ActionDropMenu from "@/components/dialogs/ActionDropMenu";
import MoveFileDialog from "@/components/dialogs/MoveFileDialog";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

interface FileActionProps {
  row: Row<File>;
}

function FileAction({ row }: FileActionProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { _id, name, collaborators, description } = row.original;

  const mutate = useMutate({
    isShowToast: true,
    options: { queryKey: ["getFiles"] },
    finallyFn: () => setDeleteDialogOpen(false),
  });

  const handleDeleteFile = () => {
    mutate.mutate({ uri: `/file/${row.original._id}`, method: "delete" });
  };

  return (
    <ActionDropMenu _id={_id} type={"file"}>
      <FileForm _id={_id} fileData={{ name, collaborators, description }}>
        <DropdownMenuItem onSelect={(event) => event.preventDefault()} className={"w-full"}>
          <FaEdit className="h-4 w-4" />
          Edit
        </DropdownMenuItem>
      </FileForm>
      <DeleteDialog
        isOpen={deleteDialogOpen}
        handleDelete={handleDeleteFile}
        setOpen={setDeleteDialogOpen}
        isLoading={mutate?.isPending}
      />
      <MoveFileDialog _id={row.original._id} existingFolderId={row.original.folder?._id}>
        <DropdownMenuItem onSelect={(event) => event.preventDefault()} className={"w-full"}>
          <Move className="h-4 w-4" />
          Move File
        </DropdownMenuItem>
      </MoveFileDialog>
    </ActionDropMenu>
  );
}

export default FileAction;
