import { useOutletContext } from "react-router";
import { Loader2 } from "lucide-react";
import useResponse from "@/hooks/useResponse.tsx";
import FilesTable from "@/components/ui/table/FilesTable.tsx";

const File = () => {
  const { data, isPending } = useResponse<FileType[]>({
    queryKeys: ["getFiles"],
    queryProps: { uri: "/file" },
  });

  if (isPending) {
    return (
      <div className={"flex-center flex-1 size-full"}>
        <div>
          <Loader2 className={"h-8 w-8 animate-spin"} />
        </div>
      </div>
    )
  }

  return <FilesTable data={data?.data ?? []} />;
};

export default File;
