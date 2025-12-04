import React from "react";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import type { File, Folder } from "@/types/file.ts";

import TrashAction from "./rows/TrashAction.tsx";
import { CiLock } from "react-icons/ci";
import ShowDate from "./rows/DisplayDate.tsx";
import HeaderLabel from "./rows/HeaderLabel.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import ProfileImg from "@/components/ProfileImg.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";

const trashColumns: ColumnDef<File | Folder>[] = [
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
          <span>{row.original.name}</span>
        </span>
        {row.original?.isLocked && <CiLock className="text-lg" />}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: HeaderLabel("Created"),
    cell: ({ row }) => <ShowDate value={row.getValue("createdAt")} />,
  },
  {
    accessorKey: "type",
    header: HeaderLabel("Type"),
    cell: ({ row }) => (
      <div className="size-full empty:bg-yellow-500">
        <Badge
          className={cn(
            row.original.type === "file"
              ? "bg-linear-to-r from-blue-400 to-blue-500 text-white"
              : "bg-linear-to-r from-yellow-400 to-yellow-500 text-white",
            "capitalize",
          )}
        >
          {row.original?.type}
        </Badge>
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
    accessorKey: "_id",
    header: HeaderLabel("Action"),
    cell: ({ row }) => <TrashAction row={row} />,
  },
];

export default trashColumns;
