import { Combobox } from '@/components/combobox';
import { Badge } from '@/components/ui/badge';
import { useSetSimpleFilterValue } from '@/hooks/useSetSimpleFilterValue';
import { GET_STATUSES_QUERY } from '@/lib/apollo-query-get-status-and-count';
import { STATUS_ICON } from '@/model/task';
import { useQuery } from '@apollo/client';
import { Table } from '@tanstack/react-table';
import { CirclePlus, CircleX } from 'lucide-react';

interface DataTableFilterSimpleStatusProps<TData> {
  table: Table<TData>;
}

export function DataTableFilterSimpleStatus<TData>({ table }: DataTableFilterSimpleStatusProps<TData>) {
  const [selectedItems, setSelectedItems] = useSetSimpleFilterValue<TData>(table, 'status');

  const { loading, error, data } = useQuery(GET_STATUSES_QUERY);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    // silent failure
    return null;
  }
  return (
    <Combobox
      items={data.statuses.map(({ name, count: totalCount }) => {
        const Icon = STATUS_ICON[name];
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
            <span>Status</span>
            {selectedItems.map((item) => (
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
