import { Input } from '@/components/ui/input';
import { useSetSimpleFilterValue } from '@/hooks/useSetSimpleFilterValue';
import { Task } from '@/model/task';
import { Table } from '@tanstack/react-table';

interface DataTableFilterTextInputProps {
  table: Table<Task>;
}
export function DataTableFilterTextInput({ table }: DataTableFilterTextInputProps) {
  const [selectedTitle, setSelectedTitle] = useSetSimpleFilterValue<string>(table, 'title');
  return (
    <Input
      id='filter-title'
      placeholder='Filter titles...'
      value={selectedTitle}
      onChange={(event) => setSelectedTitle(event.target.value)}
      className='max-w-sm'
    />
  );
}
