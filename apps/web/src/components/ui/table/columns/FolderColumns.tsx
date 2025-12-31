import { FolderDetails } from "@/types/file.ts";
import HeaderLabel from "./rows/HeaderLabel";
import { ColumnDef } from "@tanstack/react-table";
import ShowDate from "./rows/DisplayDate.tsx";
import ProfileImg from "@/components/ProfileImg.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import FolderAction from "@/components/ui/table/columns/rows/FolderAction";
import { Link } from "react-router";

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
        className={"border-black/70"}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className={"border-black/70"}
      />
    ),
  },
  {
    id: "name",
    accessorKey: "name",
    header: HeaderLabel("Name"),
    cell: ({ row }) => (
      <span className={"font-medium text-gray-900 transition-all hover:text-gray-900/80"}>
        <Link to={`/dashboard/folders/${row.original._id}`}>{row.original.name}</Link>
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: HeaderLabel("Created"),
    cell: ({ row }) => <ShowDate value={row.getValue("createdAt")} />,
  },
  {
    accessorKey: "updatedAt",
    header: HeaderLabel("Updated"),
    cell: ({ row }) => <ShowDate value={row.getValue("updatedAt")} />,
  },
  {
    accessorKey: "owner",
    header: HeaderLabel("Owner"),
    cell: ({ row }) => (
      <ProfileImg
        profileUrl={row.original.owner?.profileUrl}
        fullName={row.original.owner?.fullName}
      />
    ),
  },
  {
    accessorKey: "Actions",
    header: HeaderLabel("Actions"),
    cell: ({ row }) => <FolderAction row={row} />,
  },
];
