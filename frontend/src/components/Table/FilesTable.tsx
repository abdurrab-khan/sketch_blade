import React from "react";
import { DataTable } from "./Data-table.tsx";
import { fileColumns } from "./columns/FileColumns.tsx";
import { Button } from "../ui/button.tsx";
import { Loader2, PlusIcon } from "lucide-react";
import { useResponse } from "../../hooks/useResponse.tsx";
import { FileCreateDialog } from "../dialogs/FileCreateDialog.tsx";
import { FaFileCirclePlus } from "react-icons/fa6";
import { File as FileType } from "../../types/file.ts";

interface FilesTableProps {
  type: "all" | "my";
}

const FilesTable: React.FC<FilesTableProps> = () => {
  const { data, isPending } = useResponse<FileType[]>({
    queryKeys: ["getFiles"],
    queryProps: { uri: "/file" },
  });

  return (
    <>
      {isPending ? (
        <div className={"flex-center size-full"}>
          <div>
            <Loader2 className={"h-8 w-8 animate-spin"} />
          </div>
        </div>
      ) : data?.data != undefined && data?.data.length > 0 ? (
        <>
          <div className={"mb-3 w-full text-end"}>
            <FileCreateDialog>
              <Button className="hover:bg-tertiary/90 bg-tertiary px-6">
                Create File
                <FaFileCirclePlus className="ml-2" />
              </Button>
            </FileCreateDialog>
          </div>
          <DataTable columns={fileColumns} data={data.data} />
        </>
      ) : (
        <IfNoFile />
      )}
    </>
  );
};
export default FilesTable;

const IfNoFile = () => {
  return (
    <div className={"flex-center size-full select-none px-8 md:px-0"}>
      <div className={"w-full rounded-2xl border py-14 md:w-[600px]"}>
        <div className={"size-icon flex-center mx-auto mb-4"}>
          <img src={"/assets/icons/file.svg"} className={"size-full object-cover"} />
        </div>
        <div className={"text-center"}>
          <div className={"w-full"}>
            <FileCreateDialog>
              <Button className="hover:bg-tertiary/90 bg-tertiary px-6">
                Create File
                <PlusIcon className="ml-2 h-4 w-4" />
              </Button>
            </FileCreateDialog>
          </div>
        </div>
      </div>
    </div>
  );
};
