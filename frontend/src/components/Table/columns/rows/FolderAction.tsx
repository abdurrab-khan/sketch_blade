import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import useMutate from "@/hooks/useMutate";
import ActionDropMenu from "@/components/dialogs/ActionDropMenu";
import DeleteDialog from "@/components/dialogs/DeleteDialog";
import { FolderEditDialog } from "@/components/dialogs/FolderEditDialog";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Row } from "@tanstack/react-table";

import type { FolderDetails } from "@/types/file";

interface FolderActionProps {
    row: Row<FolderDetails>
}

const FolderAction = ({ row }: FolderActionProps) => {
    const [deleteDialog, setDeleteDialog] = useState(false);

    const mutate = useMutate({
        isShowToast: true,
        options: { queryKey: ["getFolders"] },
        finallyFn: () => setDeleteDialog(false),
    });

    const handleDelete = () => {
        mutate.mutate({
            method: "delete",
            uri: `/api/folder/${row.original._id}`
        });
    };

    return (
        <ActionDropMenu _id={row.original._id} type={"folder"}>
            <FolderEditDialog _id={row.original._id}>
                <DropdownMenuItem onSelect={(event) => event.preventDefault()} className={"w-full"}>
                    <FaEdit className={"h-4 w-4"} />
                    Edit
                </DropdownMenuItem>
            </FolderEditDialog>
            <DeleteDialog
                isOpen={deleteDialog}
                handleDelete={handleDelete}
                setOpen={setDeleteDialog}
                isLoading={mutate?.isPending}
            />
        </ActionDropMenu>
    )
}

export default FolderAction