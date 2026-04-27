import { Suspense } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import useSuspenseResponse from "@/hooks/use-suspense-response";

import type { File } from "@/types/file";

import TableSkeleton from "./components/mainpanel/table/TableSkeleton";
import FilesTable from "@/pages/dashboard/components/mainpanel/table/FilesTable";

const FilesTableContent = () => {
  const data = useSuspenseResponse<File[]>({
    queryKey: ["getFiles", "files"],
    queryProps: { uri: "/file" },
  });

  return <FilesTable data={data?.data ?? []} />;
};

const FilesContent = () => {
  const { _id: userClerkId } = useSelector((state: RootState) => state.auth);

  if (!userClerkId) {
    return <TableSkeleton />;
  }

  return <FilesTableContent />;
};

const Files = () => {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <FilesContent />
    </Suspense>
  );
};

export default Files;
