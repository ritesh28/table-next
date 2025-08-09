import { Input } from '@/components/ui/input';
import { Table } from '@tanstack/react-table';

interface DataTableFilterSimpleProps<TData> {
  table: Table<TData>;
}

export function DataTableFilterSimple<TData>({ table }: DataTableFilterSimpleProps<TData>) {
  return (
    <div>
      <Input
        placeholder='Filter titles...'
        value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
        onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
        className='max-w-sm'
      />
    </div>
  );
}
