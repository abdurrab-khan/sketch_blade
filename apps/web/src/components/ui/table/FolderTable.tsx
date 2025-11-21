import { Loader2 } from "lucide-react";
import { DataTable } from "./Data-table.tsx";
import { useResponse } from "@/hooks/useResponse.tsx";
import { folderColumns } from "./columns/FolderColumns.tsx";

import { FolderDetails } from "@/types/file.ts";

const FolderTable = () => {
  const { data, isPending } = useResponse<FolderDetails[]>({
    queryKeys: ["getFolders"],
    queryProps: { uri: "/folder" },
  });

  return (
    <>
      {isPending ? (
        <div className={"flex-center size-full"}>
          <div>
            <Loader2 className={"h-8 w-8 animate-spin"} />
          </div>
        </div>
      ) : (
        <DataTable columns={folderColumns} data={data?.data ?? []} />
      )}
    </>
  );
};

export default FolderTable;
