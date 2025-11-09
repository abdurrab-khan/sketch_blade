import { FolderDetails } from "@/types/file.ts";
import SortableHeader from "./rows/SortableHeader";
import { ColumnDef } from "@tanstack/react-table";
import ProfileImg from "@/components/ProfileImg.tsx";
import { getFormattedTime } from "@/utils/AppUtils.ts";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import FolderAction from "@/components/Table/columns/rows/FolderAction"

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
    header: SortableHeader<FolderDetails>("NAME"),
    cell: ({ row }) => <span>{row.original.name}</span>,
  },
  {
    accessorKey: "createdAt",
    header: SortableHeader<FolderDetails>("CREATED"),
    cell: ({ row }) => <div>{getFormattedTime(row.original.createdAt)}</div>,
  },
  {
    accessorKey: "updatedAt",
    header: SortableHeader<FolderDetails>("EDITED"),
    cell: ({ row }) => <div>{getFormattedTime(row.original.updatedAt)}</div>,
  },
  {
    accessorKey: "creator",
    header: "AUTHOR",
    cell: ({ row }) => (
      <ProfileImg
        profileUrl={row.original.creator.profileUrl}
        fullName={row.original.creator.fullName}
      />
    ),
  },
  {
    accessorKey: "files",
    header: "ACTIONS",
    cell: ({ row }) => <FolderAction row={row} />,
  },
];
