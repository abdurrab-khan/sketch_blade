import React from "react";

import { Button } from "../button.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table.tsx";
import {
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  Row,
} from "@tanstack/react-table";

import { File, Folder } from "@/types/file.ts";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  sorting?: SortingState;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  setSorting?: React.Dispatch<React.SetStateAction<SortingState>>;
  globalFilterFn?: (row: Row<T>) => boolean;
}

function DataTable<T extends File | Folder>({
  data,
  columns,
  sorting,
  searchValue,
  setSorting,
  setSearchValue,
  globalFilterFn,
}: DataTableProps<T>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row._id,

    onGlobalFilterChange: setSearchValue,
    globalFilterFn: globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      rowSelection,
      columnVisibility,
      sorting: sorting || [],
      globalFilter: searchValue,
    },
  });

  return (
    <div className="flex size-full flex-1 flex-col gap-4">
      <div className="flex flex-1 flex-col justify-between">
        <div className="bg-primary-bg-light dark:bg-secondary-bg-dark flex-1 rounded-xl shadow-2xl shadow-slate-500/50 dark:ring-1 dark:shadow-black/20 dark:ring-blue-500/10">
          <div className="flex flex-col gap-y-8">
            <div className="flex-1 rounded-md">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead
                            key={header.id}
                            className={"text-center text-zinc-50 uppercase dark:text-blue-400"}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => {
                      return (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                          className={"text-center"}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })
                  ) : (
                    <></>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        <div className="text-primary-text-light/80 mt-4 flex items-center justify-end space-x-2 pb-3 dark:text-slate-300">
          <div className="text-muted-foreground flex-1 text-base font-medium dark:text-slate-400">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="text-primary-text-light hover:text-primary-text-light/80 rounded-xl border-none px-3.5 transition-all outline-none hover:shadow-xl hover:shadow-slate-400/30 dark:text-slate-300 dark:hover:bg-blue-500/10 dark:hover:text-white dark:hover:shadow-none"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded-xl border-none bg-linear-to-r from-blue-400 to-blue-600 px-3.5 text-white transition-all outline-none hover:text-white/80 hover:shadow-xl hover:shadow-slate-400/30"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
