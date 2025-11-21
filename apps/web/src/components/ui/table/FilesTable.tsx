import React from "react";
import { Loader2 } from "lucide-react";
import { DataTable } from "./Data-table.tsx";
import { File as FileType } from "@/types/file.ts";
import fileColumns from "./columns/FileColumns.tsx";
import { useResponse } from "@/hooks/useResponse.tsx";
import { FaFilter } from "react-icons/fa6";
import { FaSortAmountDownAlt } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Button } from "../button.tsx";

interface FilesTableProps {
  type: "all" | "my";
}

const FilesTable: React.FC<FilesTableProps> = () => {
  const { data, isPending } = useResponse<FileType[]>({
    queryKeys: ["getFiles"],
    queryProps: { uri: "/file" },
  });

  return (
    <div className="size-full">
      {isPending ? (
        <div className={"flex-center size-full"}>
          <div>
            <Loader2 className={"h-8 w-8 animate-spin"} />
          </div>
        </div>
      ) : (
        <React.Fragment>
          <div className="mb-2.5">
            <div className="flex flex-wrap gap-x-2 gap-y-4">
              <Button variant={"outline"}>
                <span className="flex items-center text-slate-600">
                  <FaFilter />
                  <span className="ml-2">Filter</span>
                </span>
              </Button>
              <Button variant={"outline"}>
                <span className="flex items-center text-slate-600">
                  <FaSortAmountDownAlt />
                  <span className="ml-2">Filter</span>
                </span>
              </Button>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DataTable columns={fileColumns} data={data?.data ?? []} />
        </React.Fragment>
      )}
    </div>
  );
};
export default FilesTable;
