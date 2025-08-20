'use client';
import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { DataTablePagination } from '@/components/task-table/table-pagination';
import { DataTableToggleColumn } from '@/components/task-table/table-toggle-column';

import { DataTableFilterAdvanced } from '@/components/task-table/table-filter-advanced';
import { DataTableFilterSimple } from '@/components/task-table/table-filter-simple';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSize } from '@/hooks/useSize';
import { Task } from '@/model/task';
import { CSSProperties, useEffect, useRef } from 'react';
import { DataTableSort } from './table-sort-popover';
interface DataTableProps {
  columns: ColumnDef<Task>[];
  data: Task[];
}

export function DataTable({ columns, data }: DataTableProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableContainerInitialWidth = useRef<number>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const tableSize = useSize(tableRef);

  useEffect(() => {
    if (tableSize) {
      const tableWidth = tableSize.width;
      const containerWidth = tableContainerRef.current.getBoundingClientRect().width;
      if (!tableContainerInitialWidth.current) {
        tableContainerInitialWidth.current = containerWidth;
      }
      if (tableWidth < containerWidth || containerWidth < tableContainerInitialWidth.current) {
        tableContainerRef.current.style.width = tableWidth + 'px';
      }
    }
  }, [tableSize]);

  const table = useReactTable({
    data,
    columns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // pagination
    getSortedRowModel: getSortedRowModel(), // sorting
    getFilteredRowModel: getFilteredRowModel(), // filtering
  });

  return (
    <div className='grid'>
      <div className='flex items-center justify-between gap-2 py-4'>
        <div className='flex gap-2'>
          <DataTableFilterSimple table={table} />
          <Button>Advanced Search</Button>
        </div>
        <div className='flex gap-2'>
          <DataTableSort table={table} />
          <DataTableToggleColumn table={table} />
        </div>
      </div>
      <div>
        <DataTableFilterAdvanced table={table} />
      </div>
      <Table
        tableRef={tableRef}
        containerRef={tableContainerRef}
        className='table-fixed'
        containerClassName='overflow-auto rounded-md border max-h-[650px]'
        style={{ width: table.getCenterTotalSize() }}
      >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className='bg-background'
                    style={{ ...getCommonPinningStyles(header.column), ...getHeaderPinningStyles() }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className='bg-background' style={{ ...getCommonPinningStyles(cell.column) }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className='my-4'>
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}

function getCommonPinningStyles(column: Column<Task>): CSSProperties {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right');

  return {
    boxShadow: isLastLeftPinnedColumn ? '-4px 0 4px -4px gray inset' : isFirstRightPinnedColumn ? '4px 0 4px -4px gray inset' : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: isPinned ? 0.95 : 1,
    position: isPinned ? 'sticky' : 'relative',
    width: column.getSize(),
    marginInline: '5px',
    zIndex: isPinned ? 1 : 0,
  };
}

function getHeaderPinningStyles(): CSSProperties {
  return {
    position: 'sticky',
    top: 0,
    zIndex: 2,
  };
}
