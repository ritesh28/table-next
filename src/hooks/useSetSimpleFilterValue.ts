import { FILTER_COLUMN_ID } from '@/components/task-table/columns';
import { useGetFilterCount } from '@/hooks/useGetFilterCount';
import { Filter, FilterDateRange, FilterGroup, FilterGroupCollection, FilterList, FilterNumberRange, FilterString } from '@/model/table-filter';
import { Task } from '@/model/task';
import { Table } from '@tanstack/react-table';
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
    let filterGroupCollection = (table.getColumn(FILTER_COLUMN_ID).getFilterValue() ?? new FilterGroupCollection()) as FilterGroupCollection;

    let simpleFilterGroup = filterGroupCollection.simpleFilterGroup;

    if ((isString(selection) && selection === '') || (isArray(selection) && selection.length === 0)) {
      // user has removed the filter
      if (!simpleFilterGroup) return;
      simpleFilterGroup = simpleFilterGroup.deleteFilterByCol(columnId);
    } else {
      // add or update filter
      let filter: Filter;
      switch (columnId) {
        case 'status':
        case 'priority':
          if (isArray(selection)) {
            filter = new FilterList(columnId, 'has any of', selection);
          }
          break;
        case 'estimated_hours':
          if (isArray(selection) && selection.length === 2) {
            const minValue = isInteger(selection[0]) && selection[0];
            const maxValue = isInteger(selection[1]) && selection[1];
            filter = new FilterNumberRange(columnId, 'is between', minValue, maxValue);
          }
          break;
        case 'title':
          if (isString(selection)) {
            filter = new FilterString(columnId, 'contains', selection);
          }
          break;
        case 'created_at':
          if (isArray(selection) && selection.length === 2) {
            const startDate = moment.isMoment(selection[0]) && selection[0];
            const endDate = moment.isMoment(selection[1]) && selection[1];
            filter = new FilterDateRange(columnId, 'is between', startDate, endDate);
          }
          break;
        default:
          throw Error('columnId not implemented');
      }
      if (!simpleFilterGroup) {
        const filterGroup = new FilterGroup('simple');
        simpleFilterGroup = filterGroupCollection.addNewFilterGroup(filterGroup).simpleFilterGroup;
      }
      const filterIndex = simpleFilterGroup.firstFilterIndex(columnId);
      simpleFilterGroup = filterIndex === -1 ? simpleFilterGroup.addNewFilter(filter) : simpleFilterGroup.replaceFilter(filter, filterIndex);
    }
    console.log(simpleFilterGroup);

    filterGroupCollection =
      simpleFilterGroup.filters.length === 0
        ? filterGroupCollection.deleteSimpleFilterGroup()
        : filterGroupCollection.replaceSimpleFilterGroup(simpleFilterGroup);
    table.getColumn(FILTER_COLUMN_ID).setFilterValue(filterGroupCollection);
  }, [selection, columnId, table]);

  const filterCount = useGetFilterCount(table);
  useEffect(() => {
    if (filterCount === 0) {
      setSelection(defaultState<TState>(columnId));
    }
  }, [filterCount, columnId]);

  return [selection, setSelection] as const;
}
