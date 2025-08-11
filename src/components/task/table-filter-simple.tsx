import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { DataTableFilterSimplePriority } from '@/components/task/table-filter-simple-priority';
import { DataTableFilterSimpleStatus } from '@/components/task/table-filter-simple-status';
import { Table } from '@tanstack/react-table';

interface DataTableFilterSimpleProps<TData> {
  table: Table<TData>;
}

export function DataTableFilterSimple<TData>({ table }: DataTableFilterSimpleProps<TData>) {
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
      <Button>Priority</Button>
      <Button>Est. Hours</Button>
      <Button>Created At</Button>
    </div>
  );
}
