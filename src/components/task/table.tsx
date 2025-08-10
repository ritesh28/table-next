'use client';

import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

import { DataTablePagination } from '@/components/task/table-pagination';
import { DataTableToggleColumn } from '@/components/task/table-toggle-column';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { DataTableFilterAdvance } from '@/components/task/table-filter-advance';
import { DataTableFilterSimple } from '@/components/task/table-filter-simple';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CSSProperties, useState } from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [filterType, setFilterType] = useState<'simple' | 'advance'>('simple');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // pagination
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(), // sorting
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(), // filtering
    onColumnVisibilityChange: setColumnVisibility, // visibility
    onRowSelectionChange: setRowSelection, // row selection
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div>
      <div>
        <ToggleGroup
          type='single'
          value={filterType}
          onValueChange={(val) => (val === 'advance' ? setFilterType('advance') : setFilterType('simple'))}
        >
          <ToggleGroupItem value='simple'>Simple Filters</ToggleGroupItem>
          <ToggleGroupItem value='advance'>Advance Filters</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className='flex items-center justify-between gap-2 py-4'>
        <div className='grow'>{filterType === 'advance' ? <DataTableFilterAdvance table={table} /> : <DataTableFilterSimple table={table} />}</div>
        <DataTableToggleColumn table={table} />
      </div>
      <div className='overflow-hidden rounded-md border'>
        <Table className='table-fixed'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className='bg-background' style={{ ...getCommonPinningStyles(header.column) }}>
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
      </div>
      <div className='my-4'>
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}

function getCommonPinningStyles<TData>(column: Column<TData>): CSSProperties {
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
