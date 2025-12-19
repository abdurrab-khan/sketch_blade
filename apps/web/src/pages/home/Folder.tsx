import { Loader2 } from "lucide-react";
import useResponse from "@/hooks/useResponse";
import { FolderDetails } from "@/types/file";
import FolderTable from "@/components/ui/table/FolderTable.tsx";

const Folder = () => {
  const { data, isPending, isFetching } = useResponse<FolderDetails[]>({
    queryKey: ["getFolders"],
    queryProps: { uri: "/folder" },
  });

  if (isPending || isFetching) {
    return (
      <div className={"flex-center size-full flex-1"}>
        <div>
          <Loader2 className={"h-8 w-8 animate-spin"} />
        </div>
      </div>
    );
  }
  return <FolderTable data={data?.data ?? []} />;
};
export default Folder;
