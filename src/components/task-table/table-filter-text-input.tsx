import { FILTER_COLUMN_ID } from '@/components/task-table/columns';
import { Input } from '@/components/ui/input';
import { useSyncSimpleFilterGroupAndSelection } from '@/hooks/useSyncSimpleFilterGroupAndSelection';
import { FilterGroupCollection } from '@/model/table-filter-group-collection';
import { FILTER_TYPES } from '@/model/table-filters';
import { Task } from '@/model/task';
import { Table } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

interface DataTableFilterTextInputProps {
  table: Table<Task>;
}
export function DataTableFilterTextInput({ table }: DataTableFilterTextInputProps) {
  const [selection, setSelection] = useState<string | null>(null);
  const COLUMN_ID = 'title';

  useSyncSimpleFilterGroupAndSelection(table, COLUMN_ID, setSelection);

  useEffect(() => {
    table.getColumn(FILTER_COLUMN_ID)?.setFilterValue((filterGroupCollection: FilterGroupCollection | undefined) => {
      if (selection === null) {
        const newFilterGroupCollection = FilterGroupCollection.removeColumnFilterFromSimpleFilterGroup(filterGroupCollection, COLUMN_ID);
        return newFilterGroupCollection;
      }
      // add or replace filter
      const filter = new FILTER_TYPES.string(COLUMN_ID, 'contains', selection);
      const newFilterGroupCollection = FilterGroupCollection.addOrReplaceColumnFilterFromSimpleFilterGroup(filterGroupCollection, filter, COLUMN_ID);
      return newFilterGroupCollection;
    });
  }, [selection, table]);
  return (
    <Input
      id='simple-filter-title'
      placeholder='Search titles...'
      value={selection ?? ''}
      onChange={(event) => setSelection(event.target.value ? event.target.value : null)}
      className='max-w-sm'
    />
  );
}
