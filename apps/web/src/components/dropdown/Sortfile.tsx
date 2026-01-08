import { IoMdTime } from "react-icons/io";
import { MdUpdate } from "react-icons/md";
import { FaSortAmountDownAlt } from "react-icons/fa";
import { RxLetterCaseCapitalize } from "react-icons/rx";

import { Button } from "../ui/button";
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "../ui/dropdown-menu";
import DropdownLayout from "./DropdownLayout";

function Sortfile() {
  return (
    <DropdownLayout
      triggerTitle="Sort File"
      trigger={
        <Button variant={"outline"}>
          <span className="flex items-center text-slate-600 dark:text-slate-300">
            <FaSortAmountDownAlt />
            <span className="ml-2">Sort</span>
          </span>
        </Button>
      }
    >
      <DropdownMenuLabel>Sort Files</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="flex items-center gap-2">
        <RxLetterCaseCapitalize className="h-4 w-4" />
        <span>By Name</span>
      </DropdownMenuItem>
      <DropdownMenuItem className="flex items-center gap-2">
        <IoMdTime className="h-4 w-4" />
        <span>By Created</span>
      </DropdownMenuItem>
      <DropdownMenuItem className="flex items-center gap-2">
        <MdUpdate className="h-4 w-4" />
        <span>By Modified</span>
      </DropdownMenuItem>
    </DropdownLayout>
  );
}

export default Sortfile;
