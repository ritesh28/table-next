import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table } from '@tanstack/react-table';

interface DataTableFilterSimpleProps<TData> {
  table: Table<TData>;
}

export function DataTableFilterSimple<TData>({ table }: DataTableFilterSimpleProps<TData>) {
  return (
    <div className='flex justify-between gap-2'>
      <div className='flex gap-2'>
        <Input
          placeholder='Filter titles...'
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
          className='max-w-sm'
        />
        <Button>Status</Button>
        <Button>Priority</Button>
        <Button>Est. Hours</Button>
        <Button>Created At</Button>
      </div>
      <Button>Sort</Button>
    </div>
  );
}
