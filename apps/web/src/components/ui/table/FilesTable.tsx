import React from "react";

import DataTable from "./Data-table.tsx";
import fileColumns from "./columns/FileColumns.tsx";
import Filterfile from "@/components/dropdown/Filterfile.tsx";
import Sortfile from "@/components/dropdown/Sortfile.tsx";

import type { File } from "@/types/file.ts";

interface FilesTableProps {
  data: File[];
}

const FilesTable: React.FC<FilesTableProps> = ({ data }) => {
  return (
    <div className="flex size-full flex-1 flex-col">
      <div className="mb-2.5 h-fit">
        <div className="flex flex-wrap gap-x-2 gap-y-4">
          <Sortfile />
          <Filterfile />
        </div>
      </div>
      <DataTable columns={fileColumns} data={data} />
    </div>
  );
};

export default FilesTable;
