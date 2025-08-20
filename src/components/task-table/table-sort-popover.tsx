'use client';

import { ArrowUpDown, ChevronsUpDown, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Combobox } from '@/components/combobox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sortableColumns, sortableOrders, Task } from '@/model/task';
import { Table } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';

interface DataTableSortProps {
  table: Table<Task>;
}
export function DataTableSort({ table }: DataTableSortProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState<string | null>(null); // value can be column id or null. Null means all select components are in close state
  const [dropdownColumnIds, setDropdownColumnIds] = useState([...sortableColumns]);

  const sortState = table.getState().sorting;

  useEffect(() => {
    const columnWithActiveSortingList = sortState.map((s) => s.id);
    setDropdownColumnIds(sortableColumns.filter((sc) => !columnWithActiveSortingList.includes(sc.id)));
  }, [sortState]);

  const handleAddSort = useCallback(() => {
    if (dropdownColumnIds.length > 0) {
      // add the first element in dropdownItems
      const columnId = dropdownColumnIds[0].id;
      table.getColumn(columnId).toggleSorting(true, true);
    }
  }, [dropdownColumnIds, table]);

  const handleRemoveSort = useCallback(
    (columnId: string) => {
      table.getColumn(columnId).clearSorting();
    },
    [table],
  );

  const handleUpdateSort = useCallback(
    (oldColumnId: string, newColumnId: string) => {
      table.getColumn(oldColumnId).clearSorting();
      table.getColumn(newColumnId).toggleSorting(true, true);
    },
    [table],
  );

  const handleChangeSortOrder = useCallback(
    (columnId: string, val: keyof typeof sortableOrders) => {
      const idDesc = val === 'desc';
      table.getColumn(columnId).toggleSorting(idDesc, true);
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
                setSelectedItems={(newIds) => handleUpdateSort(columnSort.id, newIds[0])}
                isMultiSelect={false}
                buttonChildren={
                  <div className='w-full flex items-center justify-between'>
                    <span>{sortableColumns.find((sc) => sc.id === columnSort.id).content}</span>
                    <ChevronsUpDown />
                  </div>
                }
              />
              <Select
                open={selectOpen === columnSort.id}
                onOpenChange={(isOpen) => setSelectOpen(isOpen ? columnSort.id : null)}
                value={(columnSort.desc ? 'desc' : 'asc') as keyof typeof sortableOrders}
                onValueChange={(val) => handleChangeSortOrder(columnSort.id, val as keyof typeof sortableOrders)}
              >
                <SelectTrigger className='w-[75px]'>
                  <SelectValue placeholder={columnSort.desc ? sortableOrders['desc'] : sortableOrders['asc']} />
                </SelectTrigger>
                <SelectContent className='!w-[75px]'>
                  {Object.entries(sortableOrders).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size='icon' onClick={() => handleRemoveSort(columnSort.id)}>
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>
        <div className='flex w-full items-center gap-4'>
          <Button disabled={sortState.length === sortableColumns.length} onClick={handleAddSort}>
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
