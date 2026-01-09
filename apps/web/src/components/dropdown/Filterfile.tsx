import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useLocation } from "react-router";

import { FaFilter } from "react-icons/fa6";

import { Label } from "../ui/label";
import { Button } from "../ui/button";
import DropdownLayout from "./DropdownLayout";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { DropdownMenuLabel, DropdownMenuSeparator } from "../ui/dropdown-menu";

import { File } from "@/types/file";
import type { FileFilter } from "@/types";

type Option = { type: "folder" | "owner"; id: string; label: string };

interface IFilterLayoutProps {
  type: "folder" | "owner";
  labelTitle: string;
  options: Option[];
  filterValues: FileFilter;
  setFilterValue: React.Dispatch<React.SetStateAction<FileFilter>>;
}

interface IFileFilterProps {
  data: File[];
  filterValues: FileFilter;
  setFilterValue: React.Dispatch<React.SetStateAction<FileFilter>>;
}

const FilterRadioItem: React.FC<Option> = ({ type, id, label }) => {
  return (
    <Label
      htmlFor={`${type}-${id}`}
      className="flex w-full items-center gap-x-1.5 text-sm font-normal"
    >
      <RadioGroupItem id={`${type}-${id}`} value={id} />
      {label}
    </Label>
  );
};

const FilterLayout: React.FC<IFilterLayoutProps> = ({
  type,
  labelTitle,
  options,
  filterValues,
  setFilterValue,
}) => {
  // Handle radio button value change
  const handleValueChange = (value: string) => {
    setFilterValue((prev) => ({
      ...prev,
      [type]: value,
    }));

    // Let's update the URL query params as well
    const url = new URL(window.location.href);
    url.searchParams.set(type, value);
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <div className="not-first:mt-1.5">
      <Label>{labelTitle}</Label>
      <div className="mt-1 ml-2">
        <RadioGroup value={filterValues[type]} defaultValue="All" onValueChange={handleValueChange}>
          <FilterRadioItem type={type} id="All" label="All" />
          {options.map(({ id, label }) => (
            <FilterRadioItem type={type} key={id} id={id} label={label} />
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

function FileFilter({ data = [], filterValues, setFilterValue }: IFileFilterProps) {
  console.log("Data in FileFilter:", data);
  const { pathname } = useLocation();
  const { email: userEmail } = useSelector((root: RootState) => root.auth);
  const FilterFolderOptions = useMemo(
    () =>
      Array.from(new Map(data.map((file) => [file?.folder?._id, file?.folder?.name])))
        .filter(([id]) => id !== undefined)
        .map(([id, name]) => ({ id: id as string, label: name as string })),
    [data],
  );
  const FilterOwnerOption = useMemo(
    () =>
      Array.from(new Map(data.map((file) => [file.owner.email, file.owner.fullName]))).map(
        ([email, fullName]) => ({ id: email, label: email === userEmail ? "Me" : fullName }),
      ),
    [data, userEmail],
  );

  useEffect(() => {
    // On mount, read URL query params to set initial filter values
    const url = new URL(window.location.href);

    const folderParam = url.searchParams.get("folder");
    const ownerParam = url.searchParams.get("owner");

    setFilterValue((prev) => ({
      ...prev,
      folder: folderParam ? folderParam : prev.folder,
      owner: ownerParam ? ownerParam : prev.owner,
    }));
  }, [pathname, setFilterValue]);

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
          type="folder"
          labelTitle="Filter by folder"
          filterValues={filterValues}
          setFilterValue={setFilterValue}
          options={FilterFolderOptions}
        />
        <FilterLayout
          type="owner"
          labelTitle="Filter by owner"
          filterValues={filterValues}
          setFilterValue={setFilterValue}
          options={FilterOwnerOption}
        />
      </div>
    </DropdownLayout>
  );
}

export default FileFilter;
