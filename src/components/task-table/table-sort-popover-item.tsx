'use client';

import { ChevronsUpDown, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Combobox, ComboboxItem } from '@/components/combobox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COLUMN_METADATA } from '@/model/task';
import { ColumnSort } from '@tanstack/react-table';

const SORTABLE_COLUMNS = Object.values(COLUMN_METADATA)
  .filter((col) => col.sortable)
  .map((col) => ({ id: col.columnId, content: col.content }));

const SORTABLE_ORDERS = {
  asc: 'Asc',
  desc: 'Desc',
} as const;

interface DataTableSortItemProps {
  items: ComboboxItem[];
  columnSort: ColumnSort;
  handleUpdateSort: (oldColumnId: string, newColumnId: string) => void;
  handleChangeSortOrder: (columnId: string, val: 'asc' | 'desc') => void;
  handleRemoveSort: (columnId: string) => void;
  selectOpen: string | null;
  handleSelectOpenChange: (isOpen: boolean, columnId: string) => void;
}
export function DataTableSortItem({
  items,
  columnSort,
  handleUpdateSort,
  handleChangeSortOrder,
  handleRemoveSort,
  selectOpen,
  handleSelectOpenChange,
}: DataTableSortItemProps) {
  return (
    <>
      <Combobox
        buttonClassName='w-[175px]'
        popoverContentClassName='w-[175px]'
        items={items}
        selectedItems={[columnSort.id]}
        handleItemSelect={(newColumnId) => handleUpdateSort(columnSort.id, newColumnId)}
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
        value={(columnSort.desc ? 'desc' : 'asc') as keyof typeof SORTABLE_ORDERS}
        onValueChange={(val) => handleChangeSortOrder(columnSort.id, val as keyof typeof SORTABLE_ORDERS)}
      >
        <SelectTrigger className='w-[75px]'>
          <SelectValue placeholder={columnSort.desc ? SORTABLE_ORDERS['desc'] : SORTABLE_ORDERS['asc']} />
        </SelectTrigger>
        <SelectContent className='!w-[75px]'>
          {Object.entries(SORTABLE_ORDERS).map(([key, value]) => (
            <SelectItem key={key} value={key}>
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button size='icon' onClick={() => handleRemoveSort(columnSort.id)}>
        <Trash2 />
      </Button>
    </>
  );
}
