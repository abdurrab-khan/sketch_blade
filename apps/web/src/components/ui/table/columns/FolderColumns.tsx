import { FolderDetails } from "@/types/file.ts";
import HeaderLabel from "./rows/HeaderLabel";
import { ColumnDef } from "@tanstack/react-table";
import ProfileImg from "@/components/ProfileImg.tsx";
import { getFormattedTime } from "@/utils/AppUtils.ts";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import FolderAction from "@/components/ui/table/columns/rows/FolderAction";

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
    header: HeaderLabel("Name"),
    cell: ({ row }) => <span>{row.original.name}</span>,
  },
  {
    accessorKey: "createdAt",
    header: HeaderLabel("Created"),
    cell: ({ row }) => <div>{getFormattedTime(row.original.createdAt)}</div>,
  },
  {
    accessorKey: "updatedAt",
    header: HeaderLabel("Updated"),
    cell: ({ row }) => <div>{getFormattedTime(row.original.updatedAt)}</div>,
  },
  {
    accessorKey: "creator",
    header: HeaderLabel("Creator"),
    cell: ({ row }) => (
      <ProfileImg
        profileUrl={row.original.creator.profileUrl}
        fullName={row.original.creator.fullName}
      />
    ),
  },
  {
    accessorKey: "files",
    header: HeaderLabel("Files"),
    cell: ({ row }) => <FolderAction row={row} />,
  },
];
