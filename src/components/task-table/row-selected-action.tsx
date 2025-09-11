import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Task } from '@/model/task';
import { Row } from '@tanstack/react-table';

interface DataTableRowSelectedActionProps {
  selectedRows: Row<Task>[];
}

export function DataTableRowSelectedAction({ selectedRows }: DataTableRowSelectedActionProps) {
  return (
    <div className={cn('')}>
      <Card>
        <div>selected rows {selectedRows.length}</div>
      </Card>
    </div>
  );
}
