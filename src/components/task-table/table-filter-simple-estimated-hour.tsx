import { RangePicker } from '@/components/range-picker';
import { Skeleton } from '@/components/ui/skeleton';
import { GET_ESTIMATED_HOUR_MIN_MAX } from '@/lib/apollo-query-get-estimated-hour-min-max';
import { Task } from '@/model/task';
import { useQuery } from '@apollo/client';
import { Table } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';

import { FILTER_COLUMN_ID } from '@/components/task-table/columns';
import { useSyncSimpleFilterGroupAndSelection } from '@/hooks/useSyncSimpleFilterGroupAndSelection';
import { isTupleOfTwoNumber } from '@/lib/check-type';
import { FilterGroupCollection } from '@/model/table-filter-group-collection';
import { FILTER_VARIANTS } from '@/model/table-filters';

interface DataTableFilterSimpleEstimatedHourProps {
  table: Table<Task>;
}

export function DataTableFilterSimpleEstimatedHour({ table }: DataTableFilterSimpleEstimatedHourProps) {
  const [selection, setSelection] = useState<number | [number, number] | null>(null);
  const COLUMN_ID = 'estimated_hours';

  useSyncSimpleFilterGroupAndSelection(
    table,
    COLUMN_ID,
    useCallback((value: number | [number, number] | null) => setSelection(value), []),
  );

  useEffect(() => {
    table.getColumn(FILTER_COLUMN_ID)?.setFilterValue((filterGroupCollection: FilterGroupCollection | undefined) => {
      if (selection === null) {
        const newFilterGroupCollection = FilterGroupCollection.removeColumnFilterFromSimpleFilterGroup(filterGroupCollection, COLUMN_ID);
        return newFilterGroupCollection;
      }
      // add or replace filter
      const filter = isTupleOfTwoNumber(selection)
        ? new FILTER_VARIANTS.numberRange(COLUMN_ID, 'is between', selection)
        : new FILTER_VARIANTS.number(COLUMN_ID, 'is', selection);
      const newFilterGroupCollection = FilterGroupCollection.addOrReplaceColumnFilterFromSimpleFilterGroup(filterGroupCollection, filter, COLUMN_ID);
      return newFilterGroupCollection;
    });
  }, [selection, table]);

  const { loading, error, data } = useQuery(GET_ESTIMATED_HOUR_MIN_MAX);
  const { min, max } = data?.estimatedHour ?? { min: 0, max: 0 };

  const handleRangeChange = useCallback((range: [number, number]) => {
    if (range[0] === range[1]) return setSelection(range[0]);
    return setSelection(range);
  }, []);

  if (loading || data === undefined) {
    return <Skeleton className='h-full basis-[60px] rounded-sm' />;
  }
  if (error) {
    // hide component
    return null;
  }

  return (
    <>
      <RangePicker range={selection} min={min} max={max} onRangeChange={handleRangeChange} onRemoveRange={() => setSelection(null)} />
    </>
  );
}
