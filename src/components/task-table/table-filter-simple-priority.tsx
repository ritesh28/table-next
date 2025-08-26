import { Combobox } from '@/components/combobox';
import { FILTER_COLUMN_ID } from '@/components/task-table/columns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { GET_PRIORITIES_QUERY } from '@/lib/apollo-query-get-priority-and-count';
import { FilterGroupCollection } from '@/model/table-filter-group-collection';
import { FilterList } from '@/model/table-filters';
import { PRIORITY_ICON, Task } from '@/model/task';
import { useQuery } from '@apollo/client';
import { Table } from '@tanstack/react-table';
import { CirclePlus, CircleX } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DataTableFilterSimplePriorityProps {
  table: Table<Task>;
}

export function DataTableFilterSimplePriority({ table }: DataTableFilterSimplePriorityProps) {
  const [selection, setSelection] = useState<string[] | null>(null);
  const COLUMN_ID = 'priority';

  useEffect(() => {
    table.getColumn(FILTER_COLUMN_ID).setFilterValue((filterGroupCollection: FilterGroupCollection | undefined) => {
      if (selection === null) {
        const newFilterGroupCollection = FilterGroupCollection.removeColumnFilterFromSimpleFilterGroup(filterGroupCollection, COLUMN_ID);
        return newFilterGroupCollection;
      }
      // add or replace filter
      const filter = new FilterList(COLUMN_ID, 'has any of', selection);
      const newFilterGroupCollection = FilterGroupCollection.addOrReplaceColumnFilterFromSimpleFilterGroup(filterGroupCollection, filter, COLUMN_ID);
      return newFilterGroupCollection;
    });
  }, [selection, table]);

  const { loading, error, data } = useQuery(GET_PRIORITIES_QUERY);

  if (loading) {
    return <Skeleton className='h-full basis-[60px] rounded-sm' />;
  }
  if (error) {
    // hide component
    return null;
  }
  return (
    <Combobox
      items={data.priorities.map(({ name: id, count: totalCount }) => {
        const Icon = PRIORITY_ICON[id];
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
      selectedItems={selection}
      setSelectedItems={setSelection}
      isMultiSelect
      buttonChildren={
        selection ? (
          <div className='flex items-center gap-1'>
            <div className='hover:opacity-60' onClick={() => setSelection(null)}>
              <CircleX />
            </div>
            <span>Priority</span>
            {selection.map((item) => (
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
      includeClearButton
    />
  );
}
