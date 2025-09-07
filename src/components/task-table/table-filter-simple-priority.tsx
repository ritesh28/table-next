import { Combobox } from '@/components/combobox';
import { FILTER_COLUMN_ID } from '@/components/task-table/columns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCombobox } from '@/hooks/useCombobox';
import { useSyncSimpleFilterGroupAndSelection } from '@/hooks/useSyncSimpleFilterGroupAndSelection';
import { GET_PRIORITIES_QUERY } from '@/lib/apollo-query-get-priority-and-count';
import { FilterGroupCollection } from '@/model/table-filter-group-collection';
import { FILTER_TYPES } from '@/model/table-filters';
import { PRIORITY_ICONS, Task } from '@/model/task';
import { useQuery } from '@apollo/client';
import { Table } from '@tanstack/react-table';
import { CirclePlus, CircleX } from 'lucide-react';
import { useCallback, useEffect } from 'react';

interface DataTableFilterSimplePriorityProps {
  table: Table<Task>;
}

export function DataTableFilterSimplePriority({ table }: DataTableFilterSimplePriorityProps) {
  const IS_MULTI_SELECT = true;
  const { selectedItems, handleItemSelect, handleNewSelection, handleClearSelection } = useCombobox(null, IS_MULTI_SELECT);
  const COLUMN_ID = 'priority';

  useSyncSimpleFilterGroupAndSelection(
    table,
    COLUMN_ID,
    useCallback(
      (filterValue: string[] | null) => {
        if (filterValue === null) return handleClearSelection();
        handleNewSelection(filterValue);
      },
      [handleClearSelection, handleNewSelection],
    ),
  );

  useEffect(() => {
    table.getColumn(FILTER_COLUMN_ID)?.setFilterValue((filterGroupCollection: FilterGroupCollection | undefined) => {
      if (selectedItems === null) {
        const newFilterGroupCollection = FilterGroupCollection.removeColumnFilterFromSimpleFilterGroup(filterGroupCollection, COLUMN_ID);
        return newFilterGroupCollection;
      }
      // add or replace filter
      const filter = new FILTER_TYPES.list(COLUMN_ID, 'has any of', selectedItems);
      const newFilterGroupCollection = FilterGroupCollection.addOrReplaceColumnFilterFromSimpleFilterGroup(filterGroupCollection, filter, COLUMN_ID);
      return newFilterGroupCollection;
    });
  }, [selectedItems, table]);

  const { loading, error, data } = useQuery(GET_PRIORITIES_QUERY);

  if (loading || data === undefined) {
    return <Skeleton className='h-full basis-[60px] rounded-sm' />;
  }
  if (error) {
    // hide component
    return null;
  }
  return (
    <Combobox
      items={data.priorities.map(({ name: id, count: totalCount }) => {
        const Icon = PRIORITY_ICONS[id as Task['priority']];
        return {
          id,
          totalCount,
          content: (
            <div className='flex items-center gap-1'>
              <Icon />
              <span>{id}</span>
            </div>
          ),
        };
      })}
      selectedItems={selectedItems}
      handleItemSelect={handleItemSelect}
      handleClearSelection={handleClearSelection}
      isMultiSelect={IS_MULTI_SELECT}
      buttonChildren={
        selectedItems ? (
          <div className='flex items-center gap-1'>
            <div className='hover:opacity-60' onClick={handleClearSelection}>
              <CircleX />
            </div>
            <span>Priority</span>
            {selectedItems.map((item) => (
              <Badge key={item}>{item}</Badge>
            ))}
          </div>
        ) : (
          <div className='flex items-center gap-1'>
            <CirclePlus />
            <span>Priority</span>
          </div>
        )
      }
      searchPlaceholder='Priority'
    />
  );
}
