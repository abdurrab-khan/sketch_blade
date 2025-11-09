import { Link } from "react-router";
import { File } from "@/types/file.ts";
import ShowDate from "./rows/DisplayDate.tsx"
import FileAction from "./rows/FileAction.tsx";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import SortableHeader from "./rows/SortableHeader.tsx";
import ProfileImg from "@/components/ProfileImg.tsx";
import ActiveCollaborators from "./rows/ActiveCollaborators.tsx";

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
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "name",
    accessorKey: "name",
    header: SortableHeader<File>("NAME"),
    cell: ({ row }) => (
      <span className={"transition-all hover:text-tertiary"}>
        <Link to={`/file/${row.original._id}`}>{row.original.name}</Link>
      </span>
    ),
  },
  {
    accessorKey: "folder",
    header: SortableHeader<File>("LOCATION"),
    cell: ({ row }) => (
      <div className="empty:bg-yellow-500 size-full">
        {row.original.folder ? <span>{row.original.folder?.name}</span> : null}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: SortableHeader<File>("CREATED"),
    cell: ({ row }) => <ShowDate value={row.getValue("createdAt")} />,
  },
  {
    accessorKey: "updatedAt",
    header: SortableHeader<File>("UPDATED"),
    cell: ({ row }) => <ShowDate value={row.getValue("updatedAt")} />,
  },
  {
    accessorKey: "activeCollaborator",
    header: "ACTIVE",
    cell: ({ row }) => (
      <div className="flex items-center justify-center rounded-lg">
        <ActiveCollaborators collaborators={row.getValue("active_collaborators")} />
      </div>
    ),
  },
  {
    accessorKey: "creator",
    header: "AUTHOR",
    cell: ({ row }) =>
      row.original.creator ? (
        <ProfileImg
          fullName={row.original.creator?.fullName}
          profileUrl={row.original.creator?.profileUrl}
        />
      ) : (
        <>-</>
      ),
  },
  {
    accessorKey: "_id",
    header: "ACTIONS",
    cell: ({ row }) => <FileAction row={row} />
  },
];

export default fileColumns;