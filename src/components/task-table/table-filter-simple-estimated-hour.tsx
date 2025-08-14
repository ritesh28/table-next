import { RangePicker } from '@/components/range-picker';
import { Skeleton } from '@/components/ui/skeleton';
import { useSetSimpleFilterValue } from '@/hooks/useSetSimpleFilterValue';
import { GET_ESTIMATED_HOUR_MIN_MAX } from '@/lib/apollo-query-get-estimated-hour-min-max';
import { Task } from '@/model/task';
import { useQuery } from '@apollo/client';
import { Table } from '@tanstack/react-table';

interface DataTableFilterSimpleEstimatedHourProps {
  table: Table<Task>;
}

export function DataTableFilterSimpleEstimatedHour({ table }: DataTableFilterSimpleEstimatedHourProps) {
  const [range, setRange] = useSetSimpleFilterValue<number[]>(table, 'estimated_hours');

  const { loading, error, data } = useQuery(GET_ESTIMATED_HOUR_MIN_MAX);

  if (loading) {
    return <Skeleton className='h-full basis-[60px] rounded-sm' />;
  }
  if (error) {
    // hide component
    return null;
  }

  const { min, max } = data.estimatedHour;
  return (
    <>
      <RangePicker range={range} setRange={setRange} min={min} max={max} />
    </>
  );
}
