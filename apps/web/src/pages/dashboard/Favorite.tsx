import { Suspense } from "react";
import { useSelector } from "react-redux";
import useSuspenseResponse from "@/hooks/use-suspense-response";
import { RootState } from "@/redux/store";

import FilesTable from "@/pages/dashboard/components/mainpanel/table/FilesTable";
import TableSkeleton from "./components/mainpanel/table/TableSkeleton";

import type { File } from "@/types/file";

const FavoriteTableContent = () => {
  const data = useSuspenseResponse<File[]>({
    queryKey: ["getFavoriteFiles"],
    queryProps: { uri: "/file/favorite" },
  });

  return <FilesTable data={data.data ?? []} />;
};

const FavoriteContent = () => {
  const { _id: userClerkId } = useSelector((state: RootState) => state.auth);

  if (!userClerkId) {
    return <TableSkeleton />;
  }

  return <FavoriteTableContent />;
};

const Favorite = () => {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <FavoriteContent />
    </Suspense>
  );
};

export default Favorite;
