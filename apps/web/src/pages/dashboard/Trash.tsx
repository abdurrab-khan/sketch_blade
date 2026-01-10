import { Row } from "@tanstack/react-table";
import { useOutletContext } from "react-router";

import { Loader2 } from "lucide-react";

import { ExtendedFile, ExtendedFolder } from "@/types";

import useResponse from "@/hooks/useResponse.tsx";

import DataTable from "@/components/ui/table/Data-table.tsx";
import trashColumn from "@/components/ui/table/columns/TrashColumns.tsx";

function Trash() {
  // Get search value from outlet context
  const [searchValue, setSearchValue] = useOutletContext() as [
    string,
    React.Dispatch<React.SetStateAction<string>>,
  ];

  const { data, isPending } = useResponse<(ExtendedFile | ExtendedFolder)[]>({
    queryKey: ["getTrashData"],
    queryProps: { uri: "/trash" },
  });

  if (isPending) {
    return (
      <div className={"flex-center size-full flex-1"}>
        <div>
          <Loader2 className={"h-8 w-8 animate-spin"} />
        </div>
      </div>
    );
  }

  const globalFilterFn = (row: Row<ExtendedFile | ExtendedFolder>) => {
    const data = row.original;
    return !searchValue || data.name.toLowerCase().includes(searchValue.toLowerCase());
  };

  return (
    <DataTable
      data={data?.data || []}
      columns={trashColumn}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      globalFilterFn={globalFilterFn}
    />
  );
}

export default Trash;
