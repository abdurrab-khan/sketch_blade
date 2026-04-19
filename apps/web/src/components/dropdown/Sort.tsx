import { useEffect } from "react";
import { useLocation } from "react-router";
import { SortingState } from "@tanstack/react-table";

import { IoMdTime } from "react-icons/io";
import { MdUpdate } from "react-icons/md";
import { FaSortAmountDownAlt } from "react-icons/fa";
import { RxLetterCaseCapitalize } from "react-icons/rx";

import { Button } from "../ui/button";
import DropdownLayout from "./DropdownLayout";
import { DropdownMenuLabel, DropdownMenuSeparator } from "../ui/dropdown-menu";

import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

import { SortType } from "@/types";

interface IDropdownItemProps {
  id: SortType;
  title: string;
}

interface IFilterfileProps {
  label?: string;
  sortValue: SortingState;
  setSortValue: React.Dispatch<React.SetStateAction<SortingState>>;
}

const DropdownItem: React.FC<IDropdownItemProps> = ({ id, title }) => {
  return (
    <Label
      htmlFor={id}
      className="size-full rounded-sm px-2 py-1.5 text-start hover:bg-slate-100 has-data-[state=checked]:bg-slate-200 has-data-[state=checked]:hover:bg-slate-200 dark:hover:bg-slate-800 dark:has-data-[state=checked]:bg-slate-700 dark:has-data-[state=checked]:hover:bg-slate-700"
    >
      <div className="flex items-center gap-2">
        {id === "name" && <RxLetterCaseCapitalize size={16} />}
        {id === "createdAt" && <IoMdTime size={16} />}
        {id === "updatedAt" && <MdUpdate size={16} />}
        <span>{title}</span>
        <RadioGroupItem id={id} value={id} className="ml-auto opacity-0" />
      </div>
    </Label>
  );
};

function Sort({ label, sortValue, setSortValue }: IFilterfileProps) {
  const { pathname } = useLocation();
  const handleValueChange = (value: SortType) => {
    let desc = false;

    if (value === "createdAt" || value === "updatedAt") {
      desc = true;
    }

    setSortValue([
      {
        id: value,
        desc,
      },
    ]);

    // Let's update the URL query params as well
    const url = new URL(window.location.href);
    url.searchParams.set("sortBy", value);
    window.history.replaceState({}, "", url.toString());
  };

  useEffect(() => {
    // On mount, read the sortBy param from URL
    const url = new URL(window.location.href);
    const sortBy = url.searchParams.get("sortBy") as SortType | null;
    if (sortBy) {
      let desc = false;
      if (sortBy === "createdAt" || sortBy === "updatedAt") {
        desc = true;
      }

      setSortValue([
        {
          id: sortBy,
          desc,
        },
      ]);
    }
  }, [pathname, setSortValue]);

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
      <DropdownMenuLabel>{label || "Sort By"}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <RadioGroup
        value={sortValue[0].id}
        defaultValue="createdAt"
        onValueChange={handleValueChange}
      >
        <DropdownItem id="name" title="Name" />
        <DropdownItem id="createdAt" title="Created At" />
        <DropdownItem id="updatedAt" title="Updated At" />
      </RadioGroup>
    </DropdownLayout>
  );
}

export default Sort;
