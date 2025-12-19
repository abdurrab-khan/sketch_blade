import { useParams } from "react-router";

import { Loader2 } from "lucide-react";

import type { File, FolderDetails } from "@/types/file";
import useResponse from "@/hooks/useResponse";
import FilesTable from "@/components/ui/table/FilesTable";

interface IFolderFiles extends FolderDetails {
  files: File[];
}

function FolderFiles() {
  const { folderId } = useParams();

  const { data, isPending, isFetching } = useResponse<IFolderFiles>({
    queryProps: { uri: `/folder/files/${folderId}` },
    queryKey: ["getFiles"],
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

  return (
    <div className="flex size-full flex-1 flex-col gap-y-3">
      <div className="flex size-full flex-1 flex-col">
        <FilesTable data={data?.data?.files ?? []} />
      </div>
    </div>
  );
}

export default FolderFiles;
