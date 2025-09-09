import { RangePickerInputNumber } from '@/components/range-picker-input-number';
import { GET_ESTIMATED_HOUR_MIN_MAX } from '@/lib/apollo-query-get-estimated-hour-min-max';
import { isTupleOfTwoNumber } from '@/lib/util-check-type';
import { useQuery } from '@apollo/client';
import { Skeleton } from '../ui/skeleton';

interface DataTableFilterAdvancedValueRangeProps {
  value: number | [number, number] | null;
  onValueChange: (value: number | [number, number] | null) => void;
  disabled?: boolean;
}

export function DataTableFilterAdvancedValueRange({ value, onValueChange, disabled }: DataTableFilterAdvancedValueRangeProps) {
  const { loading, error, data } = useQuery(GET_ESTIMATED_HOUR_MIN_MAX);

  if (loading) {
    return <Skeleton className='h-full w-full rounded-sm' />;
  }
  if (error || data === undefined) {
    // hide component
    return null;
  }

  const { min, max } = data.estimatedHour;
  const value_1 = value === null ? null : isTupleOfTwoNumber(value) ? value[0] : value;
  const value_2 = value === null ? null : isTupleOfTwoNumber(value) ? value[1] : value;

  return (
    <div className='flex gap-6'>
      <RangePickerInputNumber min={min} max={max} value_1={value_1} value_2={value_2} onRangeChange={onValueChange} disabled={disabled} />
    </div>
  );
}
