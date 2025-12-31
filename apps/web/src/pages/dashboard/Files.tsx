import { Loader2 } from "lucide-react";
import useResponse from "@/hooks/useResponse.tsx";
import FilesTable from "@/components/ui/table/FilesTable.tsx";
import type { File } from "@/types/file";

const Files = () => {
  const { data, isPending } = useResponse<File[]>({
    queryKey: ["getFiles"],
    queryProps: { uri: "/file" },
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
};

export default Files;
