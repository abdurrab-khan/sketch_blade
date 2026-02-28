import { Loader2 } from "lucide-react";
import useResponse from "@/hooks/useResponse";
import { FolderDetails } from "@/types/file";
import FolderTable from "@/components/ui/table/FolderTable.tsx";

const Folders = () => {
  const { data, isPending, isFetching } = useResponse<FolderDetails[]>({
    queryKey: ["getFolders"],
    queryProps: { uri: "/folder" },
  });

  if (isPending || isFetching) {
    return (
      <div className={"flex-center size-full flex-1 dark:text-white bg-primary dark:bg-primary-bg-dark"}>
        <div>
          <Loader2 className={"h-8 w-8 animate-spin"} />
        </div>
      </div>
    );
  }
  return <FolderTable data={data?.data ?? []} />;
};
export default Folders;
