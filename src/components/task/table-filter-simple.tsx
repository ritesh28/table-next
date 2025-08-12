import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { FILTER_COLUMN_ID } from '@/components/task/columns';
import { DataTableFilterSimplePriority } from '@/components/task/table-filter-simple-priority';
import { DataTableFilterSimpleStatus } from '@/components/task/table-filter-simple-status';
import { useGetFilterCount } from '@/hooks/useGetFilterCount';
import { DEFAULT_MODEL_FILTER_GROUPS } from '@/model/table-filter';
import { Table } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { RangePicker } from '../range-picker';

interface DataTableFilterSimpleProps<TData> {
  table: Table<TData>;
}

export function DataTableFilterSimple<TData>({ table }: DataTableFilterSimpleProps<TData>) {
  const [showReset, setShowReset] = useState(false);
  const filterCount = useGetFilterCount(table);
  useEffect(() => {
    setShowReset(Boolean(filterCount));
  }, [filterCount]);

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
      <DataTableFilterSimpleStatus table={table} />
      <DataTableFilterSimplePriority table={table} />
      <RangePicker table={table} />
      {/* <Button>Est. Hours</Button> */}
      <Button>Created At</Button>
      {showReset && <Button onClick={() => table.getColumn(FILTER_COLUMN_ID).setFilterValue(DEFAULT_MODEL_FILTER_GROUPS)}>Reset</Button>}
    </div>
  );
}
