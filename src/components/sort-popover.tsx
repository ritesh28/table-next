'use client';

import { ArrowUpDown, ChevronsUpDown, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Combobox } from '@/components/combobox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sortableColumns, sortableOrders } from '@/model/task';
import { ColumnSort } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';

interface SortPopoverProps {
  sortList: ColumnSort[];
  setSortList: Dispatch<SetStateAction<ColumnSort[]>>;
}
export function SortPopover({ sortList, setSortList }: SortPopoverProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState(-1); // -1 means all select components are closed. 0 means first select is open and so on
  const [dropdownItems, setDropdownItems] = useState(sortableColumns);

  useEffect(() => {
    setDropdownItems(sortableColumns.filter((sc) => !sortList.map((s) => s.id).includes(sc.id)));
  }, [sortList]);

  const handleAddSort = useCallback(() => {
    if (dropdownItems.length > 0) {
      // add the first element in dropdownItems
      setSortList((oldSortList) => [...oldSortList, { id: dropdownItems[0].id, desc: true }]);
      setDropdownItems((oldDropdownItems) => oldDropdownItems.filter((_, index) => index !== 0));
    }
  }, [dropdownItems, setSortList, setDropdownItems]);

  const handleRemoveSort = useCallback(
    (id: string) => {
      setSortList((oldSortList) => oldSortList.filter((sort) => sort.id !== id));
      setDropdownItems((oldDropdownItems) => [...oldDropdownItems, sortableColumns.find((sc) => sc.id === id)].sort((a, b) => a.order - b.order));
    },
    [setSortList, setDropdownItems],
  );

  const handleUpdateSort = useCallback(
    (oldId: string, newId: string) => {
      setSortList((oldSortList) => [...oldSortList.filter((sort) => sort.id !== oldId), { id: newId, desc: true }]);
      setDropdownItems((oldDropdownItems) =>
        [...oldDropdownItems.filter((i) => i.id !== newId), sortableColumns.find((sc) => sc.id === oldId)].sort((a, b) => a.order - b.order),
      );
    },
    [setSortList, setDropdownItems],
  );

  const handleChangeSortOrder = useCallback(
    (id: string, val: (typeof sortableOrders)[number]['id']) => {
      setSortList((oldSortList) => oldSortList.map((s) => (s.id === id ? { id, desc: val === 'desc' } : s)));
    },
    [setSortList],
  );

  const handleResetSort = useCallback(() => {
    setSortList([]);
    setDropdownItems(sortableColumns);
  }, [setSortList, setDropdownItems]);

  return (
    <Popover open={popoverOpen} onOpenChange={(v) => selectOpen === -1 && setPopoverOpen(v)}>
      <PopoverTrigger asChild>
        <Button variant='outline' className='justify-between'>
          <ArrowUpDown />
          Sort
          {sortList.length > 0 && <Badge>{sortList.length}</Badge>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='w-[350px] p-2'>
        {sortList.length === 0 ? (
          <div>
            <div className='font-medium'>No sorting applied</div>
            <div className='text-muted-foreground text-sm'>Add sorting to organize your rows.</div>
          </div>
        ) : (
          <div className='font-medium'>Sort by</div>
        )}
        <ul className='flex flex-col max-h-[300px] gap-2 overflow-y-auto p-1'>
          {sortList.map((sort, index) => (
            <li key={sort.id} className='flex items-center justify-between'>
              <Combobox
                buttonClassName='w-[175px]'
                popoverContentClassName='w-[175px]'
                items={dropdownItems}
                selectedItems={[sortList[index].id]}
                setSelectedItems={(newIds) => handleUpdateSort(sort.id, newIds[0])}
                isMultiSelect={false}
                buttonChildren={
                  <div className='w-full flex items-center justify-between'>
                    <span>{sortableColumns.find((sc) => sc.id === sortList[index].id).content}</span>
                    <ChevronsUpDown />
                  </div>
                }
              />
              <Select
                open={selectOpen === index}
                onOpenChange={(isOpen) => setSelectOpen(isOpen ? index : -1)}
                defaultValue={sortableOrders.find((so) => so.id === 'desc').id}
                onValueChange={(val) => handleChangeSortOrder(sort.id, val as (typeof sortableOrders)[number]['id'])}
              >
                <SelectTrigger className='w-[75px]'>
                  <SelectValue
                    placeholder={sort.desc ? sortableOrders.find((so) => so.id === 'desc').name : sortableOrders.find((so) => so.id === 'asc').name}
                  />
                </SelectTrigger>
                <SelectContent className='!w-[75px]'>
                  {sortableOrders.map((sortableOrder) => (
                    <SelectItem key={sortableOrder.id} value={sortableOrder.id}>
                      {sortableOrder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size='icon' onClick={() => handleRemoveSort(sortList[index].id)}>
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>
        <div className='flex w-full items-center gap-4'>
          <Button disabled={sortList.length === sortableColumns.length} onClick={handleAddSort}>
            Add sort
          </Button>
          {sortList.length > 0 && (
            <Button variant='secondary' onClick={handleResetSort}>
              Reset sorting
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
