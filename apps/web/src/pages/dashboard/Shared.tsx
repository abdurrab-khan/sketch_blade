import { Suspense } from "react";
import { useSelector } from "react-redux";
import { File } from "@/types/file";
import { RootState } from "@/redux/store";
import useSuspenseResponse from "@/hooks/use-suspense-response";

import TableSkeleton from "./components/mainpanel/table/TableSkeleton";
import FileTable from "@/pages/dashboard/components/mainpanel/table/FilesTable";

const SharedFilesTableContent = () => {
  const data = useSuspenseResponse<File[]>({
    queryKey: ["getFiles"],
    queryProps: { uri: "/file/shared" },
  });

  return <FileTable data={data.data ?? []} />;
};

const SharedFilesContent = () => {
  const { _id: userClerkId } = useSelector((state: RootState) => state.auth);

  if (!userClerkId) {
    return <TableSkeleton />;
  }

  return <SharedFilesTableContent />;
};

const SharedFiles = () => {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <SharedFilesContent />
    </Suspense>
  );
};

export default SharedFiles;
