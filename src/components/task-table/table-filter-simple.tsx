import { Button } from '@/components/ui/button';

import { FILTER_COLUMN_ID } from '@/components/task-table/columns';
import { DataTableFilterSimpleCreatedAt } from '@/components/task-table/table-filter-simple-created-at';
import { DataTableFilterSimpleEstimatedHour } from '@/components/task-table/table-filter-simple-estimated-hour';
import { DataTableFilterSimplePriority } from '@/components/task-table/table-filter-simple-priority';
import { DataTableFilterSimpleStatus } from '@/components/task-table/table-filter-simple-status';
import { DataTableFilterTextInput } from '@/components/task-table/table-filter-text-input';
import { useGetFilterCount } from '@/hooks/useGetFilterCount';
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
    <div className='flex-row md:flex justify-between gap-2'>
      <DataTableFilterTextInput table={table} />
      <DataTableFilterSimpleStatus table={table} />
      <DataTableFilterSimplePriority table={table} />
      <DataTableFilterSimpleEstimatedHour table={table} />
      <DataTableFilterSimpleCreatedAt table={table} />
      {showReset && <Button onClick={() => table.getColumn(FILTER_COLUMN_ID).setFilterValue(undefined)}>Reset</Button>}
    </div>
  );
}
