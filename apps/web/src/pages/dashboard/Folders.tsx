import { Suspense } from "react";
import { useSelector } from "react-redux";
import useSuspenseResponse from "@/hooks/use-suspense-response";
import { RootState } from "@/redux/store";
import { FolderDetails } from "@/types/file";
import FolderTable from "@/pages/dashboard/components/mainpanel/table/FolderTable";
import FolderTableSkeleton from "@/pages/dashboard/components/mainpanel/table/TableSkeleton";

const FoldersTableContent = () => {
  const data = useSuspenseResponse<FolderDetails[]>({
    queryKey: ["getFolders"],
    queryProps: { uri: "/folder" },
  });

  console.log("Folders data:", data);

  return <FolderTable data={data.data ?? []} />;
};

const FoldersContent = () => {
  const { _id: userClerkId } = useSelector((state: RootState) => state.auth);

  if (!userClerkId) {
    return <FolderTableSkeleton actionsCount={1} />;
  }

  return <FoldersTableContent />;
};

const Folders = () => {
  return (
    <Suspense fallback={<FolderTableSkeleton actionsCount={1} />}>
      <FoldersContent />
    </Suspense>
  );
};

export default Folders;
