import { RangePickerInputNumber } from '@/components/range-picker-input-number';
import { GET_ESTIMATED_HOUR_MIN_MAX } from '@/lib/apollo-query-get-estimated-hour-min-max';
import { isTupleOfTwoNumber } from '@/lib/check-type';
import { useQuery } from '@apollo/client';
import { Dispatch, SetStateAction } from 'react';
import { Skeleton } from '../ui/skeleton';

interface DataTableFilterAdvancedValueRangeProps {
  value: number | [number, number] | null;
  setValue: Dispatch<SetStateAction<number | [number, number] | null>>;
}

export function DataTableFilterAdvancedValueRange({ value, setValue }: DataTableFilterAdvancedValueRangeProps) {
  const { loading, error, data } = useQuery(GET_ESTIMATED_HOUR_MIN_MAX);

  if (loading) {
    return <Skeleton className='h-full w-full rounded-sm' />;
  }
  if (error || data === undefined) {
    // hide component
    return null;
  }

  const { min, max } = data.estimatedHour;
  const variableMin = value === null ? min : isTupleOfTwoNumber(value) ? value[0] : value;
  const variableMax = value === null ? max : isTupleOfTwoNumber(value) ? value[1] : value;

  return (
    <div className='flex gap-6'>
      <RangePickerInputNumber min={min} max={max} variableMin={variableMin} variableMax={variableMax} setRange={setValue} />
    </div>
  );
}
