"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    RowSelectionState,
    ColumnPinningState,
} from "@tanstack/react-table";
import { DataTablePagination } from "./data-table-pagination";

import { getStyles } from "@/lib/getStyles";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    // Task 1: Row Selection State created for easy access to selected rows
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    // Task2: Pinning the first 2 columns
    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
        left: ["checkbox", "id"],
        right: [],
    });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),

        // Disabling Multi-row selection
        enableMultiRowSelection: false,
        columnResizeMode: "onChange",

        // Setting up the state for row selection and column pinning
        onRowSelectionChange: setRowSelection,
        onColumnPinningChange: setColumnPinning,
        state: {
            rowSelection: rowSelection,
            columnPinning,
        },
        defaultColumn: {
            minSize: 30,
        },
    });

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table
                    className="min-w-full table-fixed"
                    style={{
                        width: `${table.getTotalSize()}px`,
                    }}
                >
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className="relative group overflow-hidden"
                                            style={{
                                                ...getStyles(header.column),
                                            }}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext(),
                                                  )}
                                            <div
                                                className={cn(
                                                    "w-[3px] absolute top-0 right-0 bg-black cursor-col-resize touch-none select-none h-full hidden group-hover:flex hover:flex rounded-md",
                                                    header.column.getIsResizing() && "bg-blue-500",
                                                )}
                                                onDoubleClick={() => header.column.resetSize()}
                                                onMouseDown={header.getResizeHandler()}
                                                onTouchStart={header.getResizeHandler()}
                                            />
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="group"
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={cn(
                                                "overflow-hidden group-hover:bg-muted",
                                                cell.column.getIsPinned() && "bg-white",
                                                cell.row.getIsSelected() &&
                                                    cell.column.getIsPinned() &&
                                                    "bg-muted",
                                            )}
                                            style={{
                                                ...getStyles(cell.column),
                                            }}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
