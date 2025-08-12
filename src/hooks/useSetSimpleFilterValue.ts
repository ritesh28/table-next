import { FILTER_COLUMN_ID } from '@/components/task/columns';
import { useGetFilterCount } from '@/hooks/useGetFilterCount';
import { DEFAULT_FILTER_LIST_AND_OR, DEFAULT_MODEL_FILTER_GROUPS, FilterList, ModelFilterGroups } from '@/model/table-filter';
import { Table } from '@tanstack/react-table';
import { produce } from 'immer';
import { useEffect, useState } from 'react';

export function useSetSimpleFilterValue<TData>(table: Table<TData>, columnName: string) {
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const filterGroups = (table.getColumn(FILTER_COLUMN_ID).getFilterValue() ?? DEFAULT_MODEL_FILTER_GROUPS) as ModelFilterGroups;
    const nextFilterGroups = produce(filterGroups, (draftFilterGroups) => {
      // simple filter are present in first filter-group
      const filterGroup = draftFilterGroups.filterGroups[0];
      const filterIndex = filterGroup.filters.findIndex((filter) => filter.field === columnName);
      if (selectedItems.length === 0) {
        if (filterIndex === -1) return;
        filterGroup.filters.splice(filterIndex, 1);
        if (filterGroup.filters.length < 2) filterGroup.filterListAndOr = false;
      } else {
        if (filterIndex === -1)
          filterGroup.filters.push({
            field: columnName,
            operator: 'has any of',
            values: selectedItems,
          } as FilterList);
        else (filterGroup.filters[filterIndex] as FilterList).values = selectedItems;

        // check if filter count is greater than 1 and filter.AndOr is set
        if (filterGroup.filters.length > 1 && !filterGroup.filterListAndOr) filterGroup.filterListAndOr = DEFAULT_FILTER_LIST_AND_OR;
      }
    });
    table.getColumn(FILTER_COLUMN_ID).setFilterValue(nextFilterGroups);
  }, [selectedItems, columnName, table]);

  const filterCount = useGetFilterCount(table);
  useEffect(() => {
    if (filterCount === 0) {
      setSelectedItems([]);
    }
  }, [filterCount]);

  return [selectedItems, setSelectedItems] as const;
}
