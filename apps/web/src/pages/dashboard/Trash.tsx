import { Suspense } from "react";
import { Row } from "@tanstack/react-table";
import { useOutletContext } from "react-router";
import { useSelector } from "react-redux";

import { ExtendedFile, ExtendedFolder } from "@/types";

import useSuspenseResponse from "@/hooks/use-suspense-response";
import { RootState } from "@/redux/store";

import DataTable from "@/pages/dashboard/components/mainpanel/table/Data-table";
import trashColumn from "@/pages/dashboard/components/mainpanel/table/columns/TrashColumns";
import TableSkeleton from "./components/mainpanel/table/TableSkeleton";

const TrashTableContent = () => {
  // Get search value from outlet context
  const [searchValue, setSearchValue] = useOutletContext() as [
    string,
    React.Dispatch<React.SetStateAction<string>>,
  ];

  const data = useSuspenseResponse<(ExtendedFile | ExtendedFolder)[]>({
    queryKey: ["getTrashData"],
    queryProps: { uri: "/trash" },
  });

  const globalFilterFn = (row: Row<ExtendedFile | ExtendedFolder>) => {
    const data = row.original;
    return !searchValue || data.name.toLowerCase().includes(searchValue.toLowerCase());
  };

  return (
    <DataTable
      data={data.data || []}
      columns={trashColumn}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      globalFilterFn={globalFilterFn}
    />
  );
};

const TrashContent = () => {
  const { _id: userClerkId } = useSelector((state: RootState) => state.auth);

  if (!userClerkId) {
    return <TableSkeleton showActions={false} />;
  }

  return <TrashTableContent />;
};

const Trash = () => {
  return (
    <Suspense fallback={<TableSkeleton showActions={false} />}>
      <TrashContent />
    </Suspense>
  );
};

export default Trash;
