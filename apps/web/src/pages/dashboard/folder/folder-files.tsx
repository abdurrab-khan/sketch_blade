import { Suspense } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";

import type { File, FolderDetails } from "@/types/file";
import useSuspenseResponse from "@/hooks/use-suspense-response";
import FilesTable from "@/pages/dashboard/components/mainpanel/table/FilesTable";
import { RootState } from "@/redux/store";
import TableSkeleton from "../components/mainpanel/table/TableSkeleton";

interface IFolderFiles extends FolderDetails {
  files: File[];
}

const FolderFilesTableContent = () => {
  const { folderId } = useParams();

  const data = useSuspenseResponse<IFolderFiles>({
    queryKey: ["getFiles"],
    queryProps: { uri: `/folder/files/${folderId}` },
  });

  return (
    <div className="flex size-full flex-1 flex-col gap-y-3">
      <div className="flex size-full flex-1 flex-col">
        <FilesTable data={data.data?.files ?? []} />
      </div>
    </div>
  );
};

const FolderFilesContent = () => {
  const { _id: userClerkId } = useSelector((state: RootState) => state.auth);

  if (!userClerkId) {
    return <TableSkeleton />;
  }

  return <FolderFilesTableContent />;
};

const FolderFiles = () => {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <FolderFilesContent />
    </Suspense>
  );
};

export default FolderFiles;
