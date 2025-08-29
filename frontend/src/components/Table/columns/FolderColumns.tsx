import { useState } from "react";
import { Column, ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../../ui/checkbox.tsx";
import { Button } from "../../ui/button.tsx";
import ProfileImg from "../../ProfileImg.tsx";
import { ArrowUpDown } from "lucide-react";
import ActionDropMenu from "../../dialogs/ActionDropMenu.tsx";
import { DropdownMenuItem } from "../../ui/dropdown-menu.tsx";
import { FolderEditDialog } from "../../dialogs/FolderEditDialog.tsx";
import DeleteDialog from "../../dialogs/DeleteDialog.tsx";
import useMutate from "../../../hooks/useMutate.ts";
import { FaEdit } from "react-icons/fa";
import axios, { AxiosResponse } from "axios";
import { FolderDetails } from "@/types/file.ts";
import { getFormattedTime } from "@/utils/AppUtils.ts";

type ColumnType = Column<FolderDetails>;

const createSortableHeader = (label: string) => {
  return ({ column }: { column: ColumnType }) => (
    <div className={"w-full"}>
      <Button
        variant="none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="mx-auto flex items-center gap-1"
      >
        {label}
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const folderColumns: ColumnDef<FolderDetails>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className={"border-zinc-200"}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className={"border-zinc-200"}
      />
    ),
  },
  {
    id: "name",
    accessorKey: "folder_name",
    header: createSortableHeader("NAME"),
    cell: ({ row }) => <span>{row.original.name}</span>,
  },
  {
    accessorKey: "createdAt",
    header: createSortableHeader("CREATED"),
    cell: ({ row }) => <div>{getFormattedTime(row.original.createdAt)}</div>,
  },
  {
    accessorKey: "updatedAt",
    header: createSortableHeader("EDITED"),
    cell: ({ row }) => <div>{getFormattedTime(row.original.updatedAt)}</div>,
  },
  {
    accessorKey: "creator",
    header: "AUTHOR",
    cell: ({ row }) => (
      <ProfileImg
        profile_url={row.original.creator.profileUrl}
        full_name={row.original.creator.fullName}
      />
    ),
  },
  {
    accessorKey: "files",
    header: "ACTIONS",
    cell: ({ row }) => {
      const [deleteDialog, setDeleteDialog] = useState(false);

      const deleteMutation = async ({ clerkId }: { clerkId: string }): Promise<AxiosResponse> => {
        return axios.delete(`/api/folder/${row.original._id}`, {
          headers: {
            Authorization: `Bearer ${clerkId}`,
          },
        });
      };

      const mutate = useMutate({
        mutateFn: deleteMutation,
        options: { queryKey: ["getFolders"] },
        finallyFn: () => setDeleteDialog(false),
      });

      const handleDelete = () => {
        if (mutate?.mutate) {
          mutate.mutate();
        }
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
      );
    },
  },
];
