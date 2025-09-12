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

import { FILTER_COLUMN_ID } from '@/components/task-table/columns';
import { DataTableRowSelectedAction } from '@/components/task-table/row-selected-action';
import { DataTableFilterAdvanced } from '@/components/task-table/table-filter-advanced';
import { DataTableFilterSimple } from '@/components/task-table/table-filter-simple';
import { DataTableSort } from '@/components/task-table/table-sort-popover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSize } from '@/hooks/useSize';
import { FilterGroupCollection } from '@/lib/util-filter-group-collection';
import { cn } from '@/lib/utils';
import { Task } from '@/model/task';
import { ChevronDown } from 'lucide-react';
import { CSSProperties, useEffect, useRef, useState } from 'react';
interface DataTableProps {
  columns: ColumnDef<Task>[];
  data: Task[];
}

const HEADER_WIDTH = 40;
const CELL_WIDTH = 49;
export function DataTable({ columns, data }: DataTableProps) {
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerInitialWidth = useRef<number>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const tableSize = useSize(tableRef);

  useEffect(() => {
    if (tableSize && containerRef.current) {
      const tableWidth = tableSize.width;
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      if (!containerInitialWidth.current) {
        containerInitialWidth.current = containerWidth;
      }
      if (tableWidth < containerWidth || containerWidth < containerInitialWidth.current) {
        containerRef.current.style.width = tableWidth + 'px';
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
  const filterGroupCollection = table.getColumn(FILTER_COLUMN_ID)?.getFilterValue() as FilterGroupCollection | undefined;

  return (
    <div ref={containerRef}>
      <div className='flex flex-wrap items-start justify-between gap-2 py-4'>
        <div className='flex flex-wrap gap-2'>
          <DataTableFilterSimple table={table} />
          <Button variant='secondary' onClick={() => setShowAdvancedFilter((val) => !val)}>
            Advanced Search
            {(filterGroupCollection?.advancedFilterGroupCount ?? 0) > 0 && (
              <Badge>
                {filterGroupCollection?.simpleFilterGroup && '+'}
                {filterGroupCollection?.advancedFilterGroupCount}
              </Badge>
            )}
            <ChevronDown className={cn('transform transition-transform duration-500', showAdvancedFilter && 'rotate-180')} />
          </Button>
          {(filterGroupCollection?.filterGroups ?? []).length > 0 && (
            <Button onClick={() => table.getColumn(FILTER_COLUMN_ID)?.setFilterValue(undefined)}>Reset</Button>
          )}
        </div>
        <div className='flex gap-2'>
          <DataTableSort table={table} />
          <DataTableToggleColumn table={table} />
        </div>
      </div>
      <div>
        {showAdvancedFilter && (
          <div className='my-4'>
            <DataTableFilterAdvanced table={table} />
          </div>
        )}
      </div>
      <Table
        tableRef={tableRef}
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
                    style={{ ...getCommonPinningStyles(header.column, true, header.id === 'task_id' ? 3 : 2, 0) }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className='relative'>
          {table.getRowModel().rows?.length ? (
            <>
              {table.getTopRows().map((row, rowIndex) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className='bg-amber-200 dark:bg-amber-800'
                      style={{
                        ...getCommonPinningStyles(cell.column, true, cell.column.id === 'task_id' ? 3 : 2, HEADER_WIDTH + CELL_WIDTH * rowIndex),
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {table.getCenterRows().map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className='bg-background' style={{ ...getCommonPinningStyles(cell.column) }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </>
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
        <DataTableRowSelectedAction selectedRows={table.getFilteredSelectedRowModel().rows} />
      </div>
    </div>
  );
}

function getCommonPinningStyles(column: Column<Task>, isRowPinned: boolean = false, zIndex: number = 1, top: number = 1): CSSProperties {
  const isPinned = column.getIsPinned() || isRowPinned;
  const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right');

  return {
    boxShadow: isLastLeftPinnedColumn ? '-4px 0 4px -4px gray inset' : isFirstRightPinnedColumn ? '4px 0 4px -4px gray inset' : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    top: isPinned ? top : undefined,
    opacity: isPinned ? 0.95 : 1,
    position: isPinned ? 'sticky' : 'relative',
    width: column.getSize(),
    marginInline: '5px',
    zIndex: isPinned ? zIndex : 0,
  };
}
