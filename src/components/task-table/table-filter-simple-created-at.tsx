import { DatePicker } from '@/components/date-picker';
import { useSetSimpleFilterValue } from '@/hooks/useSetSimpleFilterValue';
import { Task } from '@/model/task';
import { Table } from '@tanstack/react-table';
import { Moment } from 'moment';

interface DataTableFilterSimpleCreatedAtProps {
  table: Table<Task>;
}

export function DataTableFilterSimpleCreatedAt({ table }: DataTableFilterSimpleCreatedAtProps) {
  const [dateRange, setDateRange] = useSetSimpleFilterValue<Moment[]>(table, 'created_at');

  return <DatePicker dateRange={dateRange} setDateRange={setDateRange} />;
}
