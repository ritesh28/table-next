import { FILTER_COLUMN_ID } from '@/components/task-table/columns';
import { FilterGroupCollection } from '@/model/table-filter-group-collection';
import { Filter } from '@/model/table-filters';
import { Task } from '@/model/task';
import { Table } from '@tanstack/react-table';
import { useEffect } from 'react';

export function useSyncSimpleFilterGroupAndSelection<TValue>(table: Table<Task>, columnId: string, setSelection: (val: TValue) => void) {
  const filterGroupCollection = table.getColumn(FILTER_COLUMN_ID).getFilterValue() as FilterGroupCollection | undefined;
  useEffect(() => {
    if (!filterGroupCollection || !filterGroupCollection.simpleFilterGroup) return setSelection(null);
    const filter = filterGroupCollection.simpleFilterGroup.getFilterByColumnId(columnId) as undefined | Filter<TValue>;
    if (!filter) return setSelection(null);
    return setSelection(filter.value);
  }, [filterGroupCollection, columnId, setSelection]);
}
