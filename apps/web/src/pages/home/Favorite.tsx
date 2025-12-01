import { Loader2 } from "lucide-react";
import useResponse from "@/hooks/useResponse.tsx";
import FilesTable from "@/components/ui/table/FilesTable.tsx";

function Favorite() {
  const { data, isPending } = useResponse<FileType[]>({
    queryKeys: ["getFiles"],
    queryProps: { uri: "/file/favorite" },
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

  return <FilesTable data={data?.data ?? []} />;
}

export default Favorite;
