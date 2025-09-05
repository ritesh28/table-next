import { DatePicker } from '@/components/date-picker';
import { FILTER_COLUMN_ID } from '@/components/task-table/columns';
import { useSyncSimpleFilterGroupAndSelection } from '@/hooks/useSyncSimpleFilterGroupAndSelection';
import { isTupleOfTwoMoment } from '@/lib/check-type';
import { FilterGroupCollection } from '@/model/table-filter-group-collection';
import { FILTER_TYPES } from '@/model/table-filters';
import { Task } from '@/model/task';
import { Table } from '@tanstack/react-table';
import { Moment } from 'moment';
import { useEffect, useState } from 'react';

interface DataTableFilterSimpleCreatedAtProps {
  table: Table<Task>;
}

export function DataTableFilterSimpleCreatedAt({ table }: DataTableFilterSimpleCreatedAtProps) {
  const [selection, setSelection] = useState<Moment | [Moment, Moment] | null>(null);
  const COLUMN_ID = 'created_at';

  useSyncSimpleFilterGroupAndSelection(table, COLUMN_ID, setSelection);

  useEffect(() => {
    table.getColumn(FILTER_COLUMN_ID)?.setFilterValue((filterGroupCollection: FilterGroupCollection | undefined) => {
      if (selection === null) {
        const newFilterGroupCollection = FilterGroupCollection.removeColumnFilterFromSimpleFilterGroup(filterGroupCollection, COLUMN_ID);
        return newFilterGroupCollection;
      }
      // add or replace filter
      const filter = isTupleOfTwoMoment(selection)
        ? new FILTER_TYPES.dateRange(COLUMN_ID, 'is between', selection)
        : new FILTER_TYPES.date(COLUMN_ID, 'is', selection);
      const newFilterGroupCollection = FilterGroupCollection.addOrReplaceColumnFilterFromSimpleFilterGroup(filterGroupCollection, filter, COLUMN_ID);
      return newFilterGroupCollection;
    });
  }, [selection, table]);

  return <DatePicker dateRange={selection} setDateRange={setSelection} />;
}
