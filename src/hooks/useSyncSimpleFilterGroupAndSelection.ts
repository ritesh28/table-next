import { FILTER_COLUMN_ID } from '@/components/task-table/columns';
import { FilterGroupCollection } from '@/model/table-filter-group-collection';
import { Filter } from '@/model/table-filters';
import { Task } from '@/model/task';
import { Table } from '@tanstack/react-table';
import { useEffect } from 'react';

export function useSyncSimpleFilterGroupAndSelection<TValue>(
  table: Table<Task>,
  columnId: string,
  handleSetFilterValue: (filterValue: TValue | null) => void,
) {
  const filterGroupCollection = table.getColumn(FILTER_COLUMN_ID)?.getFilterValue() as FilterGroupCollection | undefined;
  const { simpleFilterGroup } = filterGroupCollection || {};
  useEffect(() => {
    if (!simpleFilterGroup) return handleSetFilterValue(null);
    const filter = simpleFilterGroup.getFilterByColumnId(columnId) as undefined | Filter<TValue>;
    if (!filter) return handleSetFilterValue(null);
    if (filter.value) return handleSetFilterValue(filter.value);
  }, [simpleFilterGroup, columnId, handleSetFilterValue]);
}
