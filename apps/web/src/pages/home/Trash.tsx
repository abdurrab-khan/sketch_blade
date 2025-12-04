import { Loader2 } from "lucide-react";
import useResponse from "@/hooks/useResponse.tsx";
import DataTable from "@/components/ui/table/Data-table.tsx";
import trashColumn from "@/components/ui/table/columns/TrashColumns.tsx";

function Trash() {
  const { data, isPending } = useResponse<FileType[]>({
    queryKeys: ["getTrashData"],
    queryProps: { uri: "/file/trash" },
  });

  if (isPending) {
    return (
      <div className={"flex-center size-full flex-1"}>
        <div>
          <Loader2 className={"h-8 w-8 animate-spin"} />
        </div>
      </div>
    );
  }

  return <DataTable data={data?.data ?? []} columns={trashColumn} />;
}

export default Trash;
