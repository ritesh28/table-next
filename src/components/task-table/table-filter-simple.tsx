import { DataTableFilterSimpleCreatedAt } from '@/components/task-table/table-filter-simple-created-at';
import { DataTableFilterSimpleEstimatedHour } from '@/components/task-table/table-filter-simple-estimated-hour';
import { DataTableFilterSimplePriority } from '@/components/task-table/table-filter-simple-priority';
import { DataTableFilterSimpleStatus } from '@/components/task-table/table-filter-simple-status';
import { DataTableFilterTextInput } from '@/components/task-table/table-filter-text-input';
import { Task } from '@/model/task';
import { Table } from '@tanstack/react-table';

interface DataTableFilterSimpleProps {
  table: Table<Task>;
}

export function DataTableFilterSimple({ table }: DataTableFilterSimpleProps) {
  return (
    <>
      <DataTableFilterTextInput table={table} />
      <DataTableFilterSimpleStatus table={table} />
      <DataTableFilterSimplePriority table={table} />
      <DataTableFilterSimpleEstimatedHour table={table} />
      <DataTableFilterSimpleCreatedAt table={table} />
    </>
  );
}
