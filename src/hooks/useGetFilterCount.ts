import { FILTER_COLUMN_ID } from '@/components/task-table/columns';
import { DEFAULT_MODEL_FILTER_GROUPS, ModelFilterGroups } from '@/model/table-filter';
import { Task } from '@/model/task';
import { Table } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

export function useGetFilterCount(table: Table<Task>) {
  const [count, setCount] = useState(0);
  const filterGroups = (table.getColumn(FILTER_COLUMN_ID).getFilterValue() ?? DEFAULT_MODEL_FILTER_GROUPS) as ModelFilterGroups;
  useEffect(() => {
    const filterCount = filterGroups?.filterGroups.filter((fg) => fg.filters.length > 0).length ?? 0;
    setCount(filterCount);
  }, [filterGroups]);

  return count;
}
