import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router";
import { Row, SortingState } from "@tanstack/react-table";

import DataTable from "./Data-table.tsx";
import fileColumns from "./columns/FileColumns.tsx";
import Sort from "@/components/dropdown/Sort.tsx";
import Filterfile from "@/components/dropdown/Filterfile.tsx";

import type { File } from "@/types/file.ts";
import { FileFilter } from "@/types/index.ts";

interface FilesTableProps {
  data: File[];
}

const FilesTable: React.FC<FilesTableProps> = ({ data }) => {
  const [sort, setSort] = useState<SortingState>([
    {
      id: "name",
      desc: false,
    },
  ]);
  const [filter, setFilter] = useState<FileFilter>({
    folder: "All",
    owner: "All",
  });

  // Get search value from outlet context
  const [searchValue, setSearchValue] = useOutletContext() as [
    string,
    React.Dispatch<React.SetStateAction<string>>,
  ];

  // Create a filter trigger that changes when any filter state changes
  // This forces TanStack Table to re-run filtering
  const filterTrigger = useMemo(
    () => `${searchValue}|${filter.folder}|${filter.owner}`,
    [searchValue, filter.folder, filter.owner],
  );

  const globalFilterFn = (row: Row<File>) => {
    const data = row.original;

    // Check search filter first
    const matchesSearch =
      !searchValue || data.name.toLowerCase().includes(searchValue.toLowerCase());

    if (!matchesSearch) return false;

    // Check owner filter
    if (filter.owner !== "All" && data.owner.email !== filter.owner) {
      return false;
    }

    // Check folder filter
    if (filter.folder !== "All" && (!data?.folder || data.folder._id !== filter.folder)) {
      return false;
    }

    return true;
  };

  return (
    <div className="flex size-full flex-1 flex-col">
      <div className="mb-2.5 h-fit">
        <div className="flex flex-wrap gap-x-2 gap-y-4">
          <Sort sortValue={sort} setSortValue={setSort} />
          <Filterfile data={data} filterValues={filter} setFilterValue={setFilter} />
        </div>
      </div>
      <DataTable
        columns={fileColumns}
        data={data}
        sorting={sort}
        setSorting={setSort}
        searchValue={filterTrigger}
        setSearchValue={setSearchValue}
        globalFilterFn={globalFilterFn}
      />
    </div>
  );
};

export default FilesTable;
