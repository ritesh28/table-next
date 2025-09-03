import { Combobox } from '@/components/combobox';
import { FILTER_COLUMN_ID } from '@/components/task-table/columns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useSyncSimpleFilterGroupAndSelection } from '@/hooks/useSyncSimpleFilterGroupAndSelection';
import { GET_STATUSES_QUERY } from '@/lib/apollo-query-get-status-and-count';
import { FilterGroupCollection } from '@/model/table-filter-group-collection';
import { FILTER_TYPES } from '@/model/table-filters';
import { STATUS_ICON, Task } from '@/model/task';
import { useQuery } from '@apollo/client';
import { Table } from '@tanstack/react-table';
import { CirclePlus, CircleX } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DataTableFilterSimpleStatusProps {
  table: Table<Task>;
}

export function DataTableFilterSimpleStatus({ table }: DataTableFilterSimpleStatusProps) {
  const [selection, setSelection] = useState<string[] | null>(null);
  const COLUMN_ID = 'status';

  useSyncSimpleFilterGroupAndSelection(table, COLUMN_ID, setSelection);

  useEffect(() => {
    table.getColumn(FILTER_COLUMN_ID).setFilterValue((filterGroupCollection: FilterGroupCollection | undefined) => {
      if (selection === null) {
        const newFilterGroupCollection = FilterGroupCollection.removeColumnFilterFromSimpleFilterGroup(filterGroupCollection, COLUMN_ID);
        return newFilterGroupCollection;
      }
      // add or replace filter
      const filter = new FILTER_TYPES.list(COLUMN_ID, 'has any of', selection);
      const newFilterGroupCollection = FilterGroupCollection.addOrReplaceColumnFilterFromSimpleFilterGroup(filterGroupCollection, filter, COLUMN_ID);
      return newFilterGroupCollection;
    });
  }, [selection, table]);

  const { loading, error, data } = useQuery(GET_STATUSES_QUERY);

  if (loading) {
    return <Skeleton className='h-full basis-[60px] rounded-sm' />;
  }
  if (error) {
    // hide component
    return null;
  }
  return (
    <Combobox
      items={data.statuses.map(({ name: id, count: totalCount }) => {
        const Icon = STATUS_ICON[id];
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
            <span>Status</span>
            {selection.map((item) => (
              <Badge key={item}>{item}</Badge>
            ))}
          </div>
        ) : (
          <div className='flex items-center gap-1'>
            <CirclePlus />
            <span>Status</span>
          </div>
        )
      }
      searchPlaceholder='Status'
      includeClearButton
    />
  );
}
