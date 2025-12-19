import DataTable from "./Data-table.tsx";
import { folderColumns } from "./columns/FolderColumns.tsx";

import { FolderDetails } from "@/types/file.ts";

interface FolderTableProps {
  data: FolderDetails[];
}

const FolderTable = ({ data }: FolderTableProps) => {
  return <DataTable columns={folderColumns} data={data} />;
};

export default FolderTable;
