import { Task } from '@/model/task';
import { Column, Table } from '@tanstack/react-table';
import { useEffect } from 'react';
import { Checkbox } from '../ui/checkbox';

interface DataTableColumnHeaderCheckboxProps {
  table: Table<Task>;
  column: Column<Task>;
}

export function DataTableColumnHeaderCheckbox({ table, column }: DataTableColumnHeaderCheckboxProps) {
  useEffect(() => {
    column.pin('left');
  }, [column]);
  return (
    <Checkbox
      // @ts-ignore - Type 'true | "" | "indeterminate"' is not assignable to type 'CheckedState'. Type '""' is not assignable to type 'CheckedState'.ts(2322)
      checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label='Select all'
    />
  );
}
