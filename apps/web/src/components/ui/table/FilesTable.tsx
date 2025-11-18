import React from "react";
import { Loader2 } from "lucide-react";
import { DataTable } from "./Data-table.tsx";
import { File as FileType } from "@/types/file.ts";
import fileColumns from "./columns/FileColumns.tsx";
import { useResponse } from "@/hooks/useResponse.tsx";

interface FilesTableProps {
  type: "all" | "my";
}

const FilesTable: React.FC<FilesTableProps> = () => {
  const { data, isPending } = useResponse<FileType[]>({
    queryKeys: ["getFiles"],
    queryProps: { uri: "/file" },
  });

  return (
    <div className="size-full">
      {isPending ? (
        <div className={"flex-center size-full"}>
          <div>
            <Loader2 className={"h-8 w-8 animate-spin"} />
          </div>
        </div>
      ) : (
        <DataTable columns={fileColumns} data={data?.data ?? []} />
      )}
    </div>
  );
};
export default FilesTable;
