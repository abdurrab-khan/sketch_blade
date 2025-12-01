import { Link } from "react-router";
import { File } from "@/types/file.ts";
import ShowDate from "./rows/DisplayDate.tsx";
import FileAction from "./rows/FileAction.tsx";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import ProfileImg from "@/components/ProfileImg.tsx";
import ActiveCollaborators from "./rows/ActiveCollaborators.tsx";
import HeaderLabel from "./rows/HeaderLabel.tsx";
import { Badge } from "../../badge.tsx";
import { CiLock } from "react-icons/ci";

const fileColumns: ColumnDef<File>[] = [
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
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "name",
    accessorKey: "name",
    header: HeaderLabel("Name"),
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-x-1.5">
        <span className={"font-medium text-gray-900 transition-all hover:text-gray-900/80"}>
          <Link to={`/file/${row.original._id}`}>{row.original.name}</Link>
        </span>
        {row.original?.isLocked && <CiLock className="text-lg" />}
      </div>
    ),
  },
  {
    accessorKey: "owner",
    header: HeaderLabel("Owner"),
    cell: ({ row }) => (
      <ProfileImg
        fullName={row.original.owner?.fullName}
        profileUrl={row.original.owner?.profileUrl}
      />
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
    accessorKey: "collaborators",
    header: HeaderLabel("Collaborators"),
    cell: () => (
      <div className="flex items-center justify-center rounded-lg">
        <ActiveCollaborators />
      </div>
    ),
  },
  {
    accessorKey: "folder",
    header: HeaderLabel("Folder"),
    cell: ({ row }) => (
      <div className="size-full empty:bg-yellow-500">
        {row.original.folder ? (
          <Badge className="bg-blue-500 text-white">{row.original.folder?.name}</Badge>
        ) : null}
      </div>
    ),
  },
  {
    accessorKey: "_id",
    header: HeaderLabel("Actions"),
    cell: ({ row }) => <FileAction row={row} />,
  },
];

export default fileColumns;
