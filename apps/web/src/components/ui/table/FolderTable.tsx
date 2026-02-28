import { useState } from "react";
import DataTable from "./Data-table.tsx";
import { folderColumns } from "./columns/FolderColumns.tsx";

import { FolderDetails } from "@/types/file.ts";
import { Row, SortingState } from "@tanstack/react-table";
import Sortfile from "@/components/dropdown/Sort.tsx";
import { useOutletContext } from "react-router";

interface FolderTableProps {
  data: FolderDetails[];
}

const FolderTable = ({ data }: FolderTableProps) => {
  const [searchValue, setSearchValue] = useOutletContext() as [
    string,
    React.Dispatch<React.SetStateAction<string>>,
  ];
  const [sort, setSort] = useState<SortingState>([
    {
      id: "name",
      desc: false,
    },
  ]);

  const globalFilterFn = (row: Row<FolderDetails>) => {
    if (!searchValue) return true;
    const data = row.original;
    return data.name.toLowerCase().includes(searchValue.toLowerCase());
  };

  return (
    <div className="flex size-full flex-1 flex-col">
      <div className="mb-2.5 h-fit">
        <div className="flex flex-wrap gap-x-2 gap-y-4">
          <Sortfile sortValue={sort} setSortValue={setSort} />
        </div>
      </div>
      <DataTable
        columns={folderColumns}
        data={data}
        sorting={sort}
        setSorting={setSort}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        globalFilterFn={globalFilterFn}
      />
    </div>
  );
};

export default FolderTable;
