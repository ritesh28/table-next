import { FILTER_COLUMN_ID } from '@/components/task-table/columns';
import { useGetFilterCount } from '@/hooks/useGetFilterCount';
import {
  DEFAULT_FILTER_LIST_AND_OR,
  DEFAULT_MODEL_FILTER_GROUPS,
  FilterDateRange,
  FilterList,
  FilterNumberRange,
  FilterString,
  ModelFilterGroups,
} from '@/model/table-filter';
import { Task } from '@/model/task';
import { Table } from '@tanstack/react-table';
import { produce } from 'immer';
import moment from 'moment';
import { useEffect, useState } from 'react';

function isString(value: unknown): value is string {
  return typeof value === 'string' || value instanceof String;
}

function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

function isInteger(value: unknown): value is number {
  return Number.isInteger(value);
}

function defaultState<TState extends string | unknown[]>(columnId: keyof Task) {
  if (columnId === 'title') return '' as TState;
  return [] as TState;
}

export function useSetSimpleFilterValue<TState extends string | unknown[]>(table: Table<Task>, columnId: keyof Task) {
  const [selection, setSelection] = useState(() => defaultState<TState>(columnId));

  useEffect(() => {
    const filterGroups = (table.getColumn(FILTER_COLUMN_ID).getFilterValue() ?? DEFAULT_MODEL_FILTER_GROUPS) as ModelFilterGroups;
    const nextFilterGroups = produce(filterGroups, (draftFilterGroups) => {
      // simple filter are present in first filter-group
      const filterGroup = draftFilterGroups.filterGroups[0];
      // remove filter
      filterGroup.filters = filterGroup.filters.filter((filter) => filter.columnId !== columnId);
      // if user has removed the filter
      if ((isString(selection) && selection === '') || (isArray(selection) && selection.length === 0)) {
        if (filterGroup.filters.length < 2) filterGroup.filterListAndOr = false;
      } else {
        // add filter
        switch (columnId) {
          case 'status':
          case 'priority':
            if (isArray(selection)) {
              filterGroup.filters.push(new FilterList(columnId, 'has any of', selection));
            }
            break;
          case 'estimated_hours':
            if (isArray(selection) && selection.length === 2) {
              const minValue = isInteger(selection[0]) && selection[0];
              const maxValue = isInteger(selection[1]) && selection[1];
              filterGroup.filters.push(new FilterNumberRange(columnId, 'is between', minValue, maxValue));
            }
            break;
          case 'title':
            if (isString(selection)) {
              filterGroup.filters.push(new FilterString(columnId, 'contains', selection));
            }
            break;
          case 'created_at':
            if (isArray(selection) && selection.length === 2) {
              const startDate = moment.isMoment(selection[0]) && selection[0];
              const endDate = moment.isMoment(selection[1]) && selection[1];
              filterGroup.filters.push(new FilterDateRange(columnId, 'is between', startDate, endDate));
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
      setSelection(defaultState<TState>(columnId));
    }
  }, [filterCount]);

  return [selection, setSelection] as const;
}
