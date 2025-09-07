'use client';

import { ArrowUpDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { DataTableSortItem } from '@/components/task-table/table-sort-popover-item';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { COLUMN_METADATA, Task } from '@/model/task';
import { Table } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';

const SORTABLE_COLUMNS = Object.values(COLUMN_METADATA)
  .filter((col) => col.sortable)
  .map((col) => ({ id: col.columnId, content: col.content }));

const SORTABLE_ORDERS = {
  asc: 'Asc',
  desc: 'Desc',
} as const;

interface DataTableSortProps {
  table: Table<Task>;
}
// todo: maintain the order of the sort
export function DataTableSort({ table }: DataTableSortProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState<string | null>(null); // value can be column id or null. Null means all select components are in close state
  const [dropdownColumnIds, setDropdownColumnIds] = useState([...SORTABLE_COLUMNS]);

  const sortState = table.getState().sorting;

  useEffect(() => {
    const columnWithActiveSortingList = sortState.map((s) => s.id);
    setDropdownColumnIds(SORTABLE_COLUMNS.filter((sc) => !columnWithActiveSortingList.includes(sc.id)));
  }, [sortState]);

  const handleSelectOpenChange = useCallback((isOpen: boolean, columnId: string) => {
    setSelectOpen(isOpen ? columnId : null);
  }, []);

  const handleAddSort = useCallback(() => {
    if (dropdownColumnIds.length > 0) {
      // add the first element in dropdownItems
      const columnId = dropdownColumnIds[0].id;
      table.getColumn(columnId)?.toggleSorting(true, true);
    }
  }, [dropdownColumnIds, table]);

  const handleRemoveSort = useCallback(
    (columnId: string) => {
      table.getColumn(columnId)?.clearSorting();
    },
    [table],
  );

  const handleUpdateSort = useCallback(
    (oldColumnId: string, newColumnId: string) => {
      table.getColumn(oldColumnId)?.clearSorting();
      table.getColumn(newColumnId)?.toggleSorting(true, true);
    },
    [table],
  );

  const handleChangeSortOrder = useCallback(
    (columnId: string, val: keyof typeof SORTABLE_ORDERS) => {
      const idDesc = val === 'desc';
      table.getColumn(columnId)?.toggleSorting(idDesc, true);
    },
    [table],
  );

  const handleResetSort = useCallback(() => {
    table.resetSorting();
  }, [table]);

  return (
    <Popover open={popoverOpen} onOpenChange={(v) => selectOpen === null && setPopoverOpen(v)}>
      <PopoverTrigger asChild>
        <Button variant='outline' className='justify-between'>
          <ArrowUpDown />
          Sort
          {sortState.length > 0 && <Badge>{sortState.length}</Badge>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='w-[350px] p-2'>
        {sortState.length === 0 ? (
          <div>
            <div className='font-medium'>No sorting applied</div>
            <div className='text-muted-foreground text-sm'>Add sorting to organize your rows.</div>
          </div>
        ) : (
          <div className='font-medium'>Sort by</div>
        )}
        <ul className='flex flex-col max-h-[300px] gap-2 overflow-y-auto p-1'>
          {sortState.map((columnSort) => (
            <li key={columnSort.id} className='flex items-center justify-between'>
              <DataTableSortItem
                items={dropdownColumnIds}
                columnSort={columnSort}
                handleUpdateSort={handleUpdateSort}
                handleChangeSortOrder={handleChangeSortOrder}
                handleRemoveSort={handleRemoveSort}
                selectOpen={selectOpen}
                handleSelectOpenChange={handleSelectOpenChange}
              />
            </li>
          ))}
        </ul>
        <div className='flex w-full items-center gap-4'>
          <Button disabled={sortState.length === SORTABLE_COLUMNS.length} onClick={handleAddSort}>
            Add sort
          </Button>
          {sortState.length > 0 && (
            <Button variant='secondary' onClick={handleResetSort}>
              Reset sorting
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
