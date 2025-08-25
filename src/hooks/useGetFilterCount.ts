import { FILTER_COLUMN_ID } from '@/components/task-table/columns';
import { FilterGroupCollection } from '@/model/table-filter-group-collection';
import { Task } from '@/model/task';
import { Table } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

export function useGetFilterCount(table: Table<Task>) {
  const [count, setCount] = useState(0);
  const filterGroupCollection = table.getColumn(FILTER_COLUMN_ID).getFilterValue() as FilterGroupCollection | undefined;

  useEffect(() => {
    if (!filterGroupCollection) return setCount(0);
    const filterCount = filterGroupCollection.filterGroups?.filter((fg) => fg.filters.length > 0).length ?? 0;
    setCount(filterCount);
  }, [filterGroupCollection]);

  return count;
}
