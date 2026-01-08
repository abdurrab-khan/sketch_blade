import React from "react";

import { FaFilter } from "react-icons/fa6";

import { Label } from "../ui/label";
import { Button } from "../ui/button";
import DropdownLayout from "./DropdownLayout";
import { DropdownMenuLabel, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface IFilterLayoutProps {
  labelTitle: string;
  options: {
    id: string;
    label: string;
  }[];
}

const FilterLayout = ({ labelTitle, options }: IFilterLayoutProps) => {
  return (
    <div className="not-first:mt-1">
      <Label>{labelTitle}</Label>
      <div className="mt-1 ml-2">
        <RadioGroup defaultValue="">
          {options.map(({ id, label }) => (
            <div className="flex items-center gap-x-1.5">
              <RadioGroupItem value={label} id={id} />
              <Label htmlFor={id} className="w-full text-sm font-normal">
                {label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

function Filterfile() {
  return (
    <DropdownLayout
      triggerTitle="Filter File"
      trigger={
        <Button variant={"outline"}>
          <span className="flex items-center text-slate-600 dark:text-slate-300">
            <FaFilter />
            <span className="ml-2">Filter</span>
          </span>
        </Button>
      }
      contentClassName="min-w-48"
    >
      <DropdownMenuLabel>Filter Files</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <div className="px-1.5">
        <FilterLayout
          labelTitle="Filter by folder"
          options={[
            { id: "inbox", label: "Inbox" },
            { id: "projects", label: "Projects" },
            { id: "designs", label: "Designs" },
            { id: "documents", label: "Documents" },
          ]}
        />
        <FilterLayout
          labelTitle="Filter by owner"
          options={[
            { id: "me", label: "Me" },
            { id: "team", label: "Team" },
            { id: "guest", label: "Guest" },
          ]}
        />
      </div>
    </DropdownLayout>
  );
}

export default Filterfile;
