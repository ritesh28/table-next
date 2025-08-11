import { Combobox } from '@/components/combobox';
import { Badge } from '@/components/ui/badge';
import { GET_PRIORITIES_QUERY } from '@/lib/apollo-query-get-priority-and-count';
import { PRIORITY_ICON } from '@/model/task';
import { useQuery } from '@apollo/client';
import { Table } from '@tanstack/react-table';
import { CirclePlus, CircleX } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DataTableFilterSimplePriorityProps<TData> {
  table: Table<TData>;
}

export function DataTableFilterSimplePriority<TData>({ table }: DataTableFilterSimplePriorityProps<TData>) {
  const [selectedItems, setSelectedItems] = useState([]);
  useEffect(() => {
    if (selectedItems.length === 0) {
      table.resetColumnFilters();
    } else {
      table.getColumn('task_id').setFilterValue(selectedItems);
    }
  }, [selectedItems]);

  const { loading, error, data } = useQuery(GET_PRIORITIES_QUERY);
  // todo: update status cache

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    // silent failure
    return null;
  }
  return (
    <Combobox
      items={data.priorities.map(({ name, count: totalCount }) => {
        const Icon = PRIORITY_ICON[name];
        return {
          name,
          totalCount,
          content: (
            <div className='flex items-center gap-1'>
              <Icon />
              <span>{name}</span>
            </div>
          ),
        };
      })}
      selectedItems={selectedItems}
      setSelectedItems={setSelectedItems}
      isMultiSelect
      buttonChildren={
        selectedItems.length ? (
          <div className='flex items-center gap-1'>
            <div
              className='hover:opacity-60'
              onClick={(e) => {
                e.preventDefault();
                setSelectedItems([]);
              }}
            >
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
      includeClearButton
    />
  );
}
