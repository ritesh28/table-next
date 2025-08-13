import { Input } from '@/components/ui/input';
import { useSetSimpleFilterValue } from '@/hooks/useSetSimpleFilterValue';
import { Task } from '@/model/task';
import { Table } from '@tanstack/react-table';

interface DataTableFilterTextInputProps {
  table: Table<Task>;
}
function DataTableFilterTextInput({ table }: DataTableFilterTextInputProps) {
  const [selectedItems, setSelectedItems] = useSetSimpleFilterValue<string>(table, 'title');
  return (
    <Input
      id='filter-title'
      placeholder='Filter titles or task ID...'
      value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
      onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
      className='max-w-sm'
    />
  );
}
