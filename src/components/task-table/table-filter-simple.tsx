import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { FILTER_COLUMN_ID } from '@/components/task-table/columns';
import { DataTableFilterSimpleEstimatedHour } from '@/components/task-table/table-filter-simple-estimated-hour';
import { DataTableFilterSimplePriority } from '@/components/task-table/table-filter-simple-priority';
import { DataTableFilterSimpleStatus } from '@/components/task-table/table-filter-simple-status';
import { useGetFilterCount } from '@/hooks/useGetFilterCount';
import { DEFAULT_MODEL_FILTER_GROUPS } from '@/model/table-filter';
import { Task } from '@/model/task';
import { Table } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

interface DataTableFilterSimpleProps {
  table: Table<Task>;
}

export function DataTableFilterSimple({ table }: DataTableFilterSimpleProps) {
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
      <DataTableFilterSimpleEstimatedHour table={table} />
      <Button>Created At</Button>
      {showReset && <Button onClick={() => table.getColumn(FILTER_COLUMN_ID).setFilterValue(DEFAULT_MODEL_FILTER_GROUPS)}>Reset</Button>}
    </div>
  );
}
