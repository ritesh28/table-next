import { Combobox } from '@/components/combobox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GET_STATUSES_QUERY } from '@/lib/apollo-query-get-status-and-count';
import { useQuery } from '@apollo/client';
import { Table } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

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
  useEffect(() => {
    if (selectedItems.length === 0) {
      table.resetColumnFilters();
    } else {
      table.getColumn('task_id').setFilterValue(selectedItems);
    }
  }, [selectedItems]);

  const { loading, error, data } = useQuery(GET_STATUSES_QUERY);
  // update status cache

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Something went wrong...</div>;
  }

  // todo: mutation
  //  const [addSign] = useMutation(ADD_SIGN, {
  //   onCompleted() {
  //     router.push('/');
  //   },
  // });

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
        isMultiSelect
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
