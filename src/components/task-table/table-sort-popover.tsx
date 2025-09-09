'use client';

import { ArrowUpDown, ChevronsUpDown, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { COLUMN_METADATA, Task } from '@/model/task';
import { Table } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';

import { Combobox } from '@/components/combobox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SORTABLE_COLUMNS = Object.values(COLUMN_METADATA)
  .filter((col) => col.sortable)
  .map((col) => ({ id: col.columnId, content: col.content }));

const SORT_DIRECTIONS = {
  asc: 'Asc',
  desc: 'Desc',
} as const;

interface DataTableSortProps {
  table: Table<Task>;
}

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

  const handleAddColumnId = useCallback(() => {
    if (dropdownColumnIds.length > 0) {
      // add the first element in dropdownItems
      const columnId = dropdownColumnIds[0].id;
      table.setSorting((sortState) => [...sortState, { id: columnId, desc: true }]);
    }
  }, [dropdownColumnIds, table]);

  const handleRemoveColumnId = useCallback(
    (columnId: string) => {
      table.setSorting((sortState) => sortState.filter((ss) => ss.id !== columnId));
    },
    [table],
  );

  const handleUpdateColumnId = useCallback(
    (oldColumnId: string, newColumnId: string) => {
      table.setSorting((sortState) => sortState.map((ss) => (ss.id === oldColumnId ? { ...ss, id: newColumnId } : ss)));
    },
    [table],
  );

  const handleToggleSortDirection = useCallback(
    (columnId: string, val: keyof typeof SORT_DIRECTIONS) => {
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
              <Combobox
                buttonClassName='w-[175px]'
                popoverContentClassName='w-[175px]'
                items={dropdownColumnIds}
                selectedItems={[columnSort.id]}
                handleItemSelect={(newColumnId) => handleUpdateColumnId(columnSort.id, newColumnId)}
                isMultiSelect={false}
                buttonChildren={
                  <div className='w-full flex items-center justify-between'>
                    <span>{SORTABLE_COLUMNS.find((sc) => sc.id === columnSort.id)?.content}</span>
                    <ChevronsUpDown />
                  </div>
                }
              />
              <Select
                open={selectOpen === columnSort.id}
                onOpenChange={(isOpen) => handleSelectOpenChange(isOpen, columnSort.id)}
                value={(columnSort.desc ? 'desc' : 'asc') as keyof typeof SORT_DIRECTIONS}
                onValueChange={(val) => handleToggleSortDirection(columnSort.id, val as keyof typeof SORT_DIRECTIONS)}
              >
                <SelectTrigger className='w-[75px]'>
                  <SelectValue placeholder={columnSort.desc ? SORT_DIRECTIONS['desc'] : SORT_DIRECTIONS['asc']} />
                </SelectTrigger>
                <SelectContent className='!w-[75px]'>
                  {Object.entries(SORT_DIRECTIONS).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size='icon' onClick={() => handleRemoveColumnId(columnSort.id)}>
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>
        <div className='flex w-full items-center gap-4'>
          <Button disabled={sortState.length === SORTABLE_COLUMNS.length} onClick={handleAddColumnId}>
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
