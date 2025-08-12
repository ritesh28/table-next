import { useSetSimpleFilterValue } from '@/hooks/useSetSimpleFilterValue';
import { GET_ESTIMATED_HOUR_MIN_MAX } from '@/lib/apollo-query-get-estimated-hour-min-max';
import { useQuery } from '@apollo/client';
import { Table } from '@tanstack/react-table';
import { RangePicker } from '../range-picker';

interface DataTableFilterSimpleEstimatedHourProps<TData> {
  table: Table<TData>;
}

export function DataTableFilterSimpleEstimatedHour<TData>({ table }: DataTableFilterSimpleEstimatedHourProps<TData>) {
  const [range, setRange] = useSetSimpleFilterValue<TData>(table, 'status'); //todo

  const { loading, error, data } = useQuery(GET_ESTIMATED_HOUR_MIN_MAX);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    // silent failure
    return null;
  }

  const { min, max } = data.estimatedHour;
  return <RangePicker table={table} min={min} max={max} />;
}
