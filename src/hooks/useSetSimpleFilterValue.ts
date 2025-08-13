import { FILTER_COLUMN_ID } from '@/components/task-table/columns';
import { useGetFilterCount } from '@/hooks/useGetFilterCount';
import { DEFAULT_FILTER_LIST_AND_OR, DEFAULT_MODEL_FILTER_GROUPS, FilterList, FilterNumberRange, ModelFilterGroups } from '@/model/table-filter';
import { Task } from '@/model/task';
import { Table } from '@tanstack/react-table';
import { produce } from 'immer';
import { useEffect, useState } from 'react';

export function useSetSimpleFilterValue(table: Table<Task>, columnId: keyof Task) {
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const filterGroups = (table.getColumn(FILTER_COLUMN_ID).getFilterValue() ?? DEFAULT_MODEL_FILTER_GROUPS) as ModelFilterGroups;
    const nextFilterGroups = produce(filterGroups, (draftFilterGroups) => {
      // simple filter are present in first filter-group
      const filterGroup = draftFilterGroups.filterGroups[0];
      // remove filter
      filterGroup.filters = filterGroup.filters.filter((filter) => filter.columnId !== columnId);
      // if user has removed the filter
      if (selectedItems.length === 0) {
        if (filterGroup.filters.length < 2) filterGroup.filterListAndOr = false;
      } else {
        // add filter
        switch (columnId) {
          case 'status':
          case 'priority':
            filterGroup.filters.push(new FilterList(columnId, 'has any of', selectedItems));
            break;
          case 'estimated_hours':
            const minValue = selectedItems[0] ?? 0;
            const maxValue = selectedItems[1] ?? minValue;
            filterGroup.filters.push(new FilterNumberRange(columnId, 'is between', minValue, maxValue));
            break;
          default:
            throw Error('columnId not implemented');
        }
        // check if filter count is greater than 1 and filter.AndOr is set
        if (filterGroup.filters.length > 1 && !filterGroup.filterListAndOr) filterGroup.filterListAndOr = DEFAULT_FILTER_LIST_AND_OR;
      }
    });
    table.getColumn(FILTER_COLUMN_ID).setFilterValue(nextFilterGroups);
  }, [selectedItems, columnId, table]);

  const filterCount = useGetFilterCount(table);
  useEffect(() => {
    if (filterCount === 0) {
      setSelectedItems([]);
    }
  }, [filterCount]);

  return [selectedItems, setSelectedItems] as const;
}
