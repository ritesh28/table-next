import { Input } from '@/components/ui/input';
import { Table } from '@tanstack/react-table';

interface DataTableFilterAdvanceProps<TData> {
  table: Table<TData>;
}

export function DataTableFilterAdvance<TData>({ table }: DataTableFilterAdvanceProps<TData>) {
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
