import { Combobox } from '@/components/combobox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table } from '@tanstack/react-table';
import { useState } from 'react';

interface DataTableFilterSimpleProps<TData> {
  table: Table<TData>;
}

const items = [
  {
    name: 'todo',
    reactNode: 'Todo',
    totalCount: 14,
  },
  {
    name: 'done',
    reactNode: 'Done',
    totalCount: 20,
  },
  {
    name: 'canceled',
    reactNode: 'Canceled',
    totalCount: 16,
  },
];

export function DataTableFilterSimple<TData>({ table }: DataTableFilterSimpleProps<TData>) {
  const [selectedItems, setSelectedItems] = useState([]);
  return (
    <div className='flex justify-between gap-2'>
      <Input
        placeholder='Filter titles...'
        value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
        onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
        className='max-w-sm'
      />
      <Combobox
        items={items}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        isMultiSelect={false}
        buttonChildren={selectedItems.length ? selectedItems[0] : 'Status'}
        searchPlaceholder='Status'
        includeClearButton
      />
      <Button>Priority</Button>
      <Button>Est. Hours</Button>
      <Button>Created At</Button>
    </div>
  );
}
