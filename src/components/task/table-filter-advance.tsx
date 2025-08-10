import { Button } from '@/components/ui/button';
import { Table } from '@tanstack/react-table';

interface DataTableFilterAdvanceProps<TData> {
  table: Table<TData>;
}

export function DataTableFilterAdvance<TData>({ table }: DataTableFilterAdvanceProps<TData>) {
  return (
    <div className='flex gap-2'>
      <Button>Sort</Button>
      <Button>Filter</Button>
    </div>
  );
}
