import { File } from "@/types/file";
import { Loader2 } from "lucide-react";
import useResponse from "@/hooks/useResponse";
import FileTable from "@/components/ui/table/FilesTable.tsx";

function SharedFiles() {
  const { data, isPending } = useResponse<File[]>({
    queryKey: ["getFiles"],
    queryProps: { uri: "/file/shared" },
  });

  if (isPending) {
    return (
      <div className={"flex-center size-full flex-1 dark:text-white bg-primary dark:bg-primary-bg-dark"}>
        <div>
          <Loader2 className={"h-8 w-8 animate-spin"} />
        </div>
      </div>
    );
  }

  return <FileTable data={data?.data ?? []} />;
}

export default SharedFiles;
