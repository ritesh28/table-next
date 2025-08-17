'use client';

import { ArrowUpDown, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Combobox, ComboboxItem } from '@/components/combobox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ColumnSort } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useState } from 'react';

const sortableColumns: ComboboxItem<string>[] = [
  {
    id: 'title',
    content: 'Title',
  },
  {
    id: 'status',
    content: 'Status',
  },
  {
    id: 'priority',
    content: 'Priority',
  },
  {
    id: 'est_hours',
    content: 'Est. Hours',
  },
  {
    id: 'created_at',
    content: 'Created At',
  },
] as const;

const sortableOrders = [
  {
    id: 'asc',
    name: 'ASC',
  },
  {
    id: 'desc',
    name: 'Desc',
  },
] as const;

interface SortPopoverProps {
  sortList: ColumnSort[];
  setSortList: Dispatch<SetStateAction<ColumnSort[]>>;
}
export function SortPopover({ sortList, setSortList }: SortPopoverProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);

  return (
    <Popover open={popoverOpen} onOpenChange={(v) => !selectOpen && setPopoverOpen(v)}>
      <PopoverTrigger asChild>
        <Button variant='outline' className='justify-between'>
          <ArrowUpDown />
          Sort
          {sortList.length > 0 && <Badge>{sortList.length}</Badge>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='w-[400px] p-1'>
        {sortList.length === 0 ? (
          <div>
            <div className='font-medium leading-none'>No sorting applied</div>
            <div className='text-muted-foreground text-sm'>Add sorting to organize your rows.</div>
          </div>
        ) : (
          <div className='font-medium leading-none'>Sort by</div>
        )}
        <ul className='flex flex-col max-h-[300px] gap-2 overflow-y-auto p-1'>
          {sortList.map((sort, index) => (
            <li key={sort.id} className='flex items-center justify-between'>
              <Combobox
                buttonClassName='w-[175px]'
                popoverContentClassName='w-[175px]'
                items={sortableColumns.filter((col) => !sortList.map((l) => l.id).includes(col.id))}
                selectedItems={[sortList.map((l) => l.id)[index]]}
                setSelectedItems={() => {}}
                isMultiSelect={false}
                buttonChildren={sortList.map((l) => l.id)[index]}
              />
              <Select open={selectOpen} onOpenChange={setSelectOpen}>
                <SelectTrigger className='w-[75px]'>
                  <SelectValue
                    placeholder={sort.desc ? sortableOrders.find((so) => so.id === 'desc').name : sortableOrders.find((so) => so.id === 'asc').name}
                  />
                </SelectTrigger>
                <SelectContent>
                  {sortableOrders.map((sortableOrder) => (
                    <SelectItem key={sortableOrder.id} value={sortableOrder.id}>
                      {sortableOrder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size='icon'>
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>
        <div className='flex w-full items-center gap-4'>
          <Button disabled className='disabled:cursor-not-allowed'>
            Add sort
          </Button>
          {sortList.length > 0 && <Button variant='secondary'>Reset sorting</Button>}
        </div>
      </PopoverContent>
    </Popover>
  );
}
