import { FILTER_COLUMN_ID } from '@/components/task-table/columns';
import { useGetFilterCount } from '@/hooks/useGetFilterCount';
import { DEFAULT_FILTER_LIST_AND_OR, DEFAULT_MODEL_FILTER_GROUPS, FilterList, FilterNumberRange, ModelFilterGroups } from '@/model/table-filter';
import { Task } from '@/model/task';
import { Table } from '@tanstack/react-table';
import { produce } from 'immer';
import { useEffect, useState } from 'react';

function defaultState(columnId: keyof Task) {
  if (columnId === 'title') return '';
  return [];
}

export function useSetSimpleFilterValue<TSelection extends string | unknown[]>(table: Table<Task>, columnId: keyof Task) {
  const [selection, setSelection] = useState(() => defaultState(columnId) as TSelection);

  useEffect(() => {
    const filterGroups = (table.getColumn(FILTER_COLUMN_ID).getFilterValue() ?? DEFAULT_MODEL_FILTER_GROUPS) as ModelFilterGroups;
    const nextFilterGroups = produce(filterGroups, (draftFilterGroups) => {
      // simple filter are present in first filter-group
      const filterGroup = draftFilterGroups.filterGroups[0];
      // remove filter
      filterGroup.filters = filterGroup.filters.filter((filter) => filter.columnId !== columnId);
      // if user has removed the filter
      if ((selection as string) === '' || (selection as unknown[]).length === 0) {
        if (filterGroup.filters.length < 2) filterGroup.filterListAndOr = false;
      } else {
        // add filter
        switch (columnId) {
          case 'status':
          case 'priority':
            if (selection instanceof Array) {
              filterGroup.filters.push(new FilterList(columnId, 'has any of', selection));
            }
            break;
          case 'estimated_hours':
            if (selection instanceof Array) {
              const minValue = (selection[0] as number) ?? 0;
              const maxValue = (selection[1] as number) ?? minValue;
              filterGroup.filters.push(new FilterNumberRange(columnId, 'is between', minValue, maxValue));
            }
            break;
          default:
            throw Error('columnId not implemented');
        }
        // check if filter count is greater than 1 and filter.AndOr is set
        if (filterGroup.filters.length > 1 && !filterGroup.filterListAndOr) filterGroup.filterListAndOr = DEFAULT_FILTER_LIST_AND_OR;
      }
    });
    table.getColumn(FILTER_COLUMN_ID).setFilterValue(nextFilterGroups);
  }, [selection, columnId, table]);

  const filterCount = useGetFilterCount(table);
  useEffect(() => {
    if (filterCount === 0) {
      setSelection(defaultState(columnId) as TSelection);
    }
  }, [filterCount]);

  return [selection, setSelection] as const;
}
