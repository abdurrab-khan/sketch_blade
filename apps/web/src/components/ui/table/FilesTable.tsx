import React from "react";
import DataTable from "./Data-table.tsx";
import type { File } from "@/types/file.ts";
import fileColumns from "./columns/FileColumns.tsx";
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
  data: File[];
}

const FilesTable: React.FC<FilesTableProps> = ({ data }) => {
  return (
    <div className="flex size-full flex-1 flex-col">
      <div className="mb-2.5 h-fit">
        <div className="flex flex-wrap gap-x-2 gap-y-4">
          <Button variant={"outline"}>
            <span className="flex items-center text-slate-600 dark:text-slate-300">
              <FaFilter />
              <span className="ml-2">Filter</span>
            </span>
          </Button>
          <Button variant={"outline"}>
            <span className="flex items-center text-slate-600 dark:text-slate-300">
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
      <DataTable columns={fileColumns} data={data} />
    </div>
  );
};

export default FilesTable;
