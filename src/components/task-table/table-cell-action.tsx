import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Task } from '@/model/task';
import { Row } from '@tanstack/react-table';
import { MoreHorizontal, Pin, PinOff } from 'lucide-react';

import { TaskSheet } from '@/components/task-sheet';
import { Button } from '@/components/ui/button';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

interface DataTableCellActionProps {
  row: Row<Task>;
}
export function DataTableCellAction({ row }: DataTableCellActionProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleCopy = useCallback((task_id: string) => {
    navigator.clipboard.writeText(task_id);
    toast.success('Copied');
  }, []);

  const task = row.original;
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleCopy(task.task_id)}>Copy Task ID</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSheetOpen(true)}>View</DropdownMenuItem>
          <DropdownMenuSeparator />
          {row.getIsPinned() ? (
            <DropdownMenuItem onClick={() => row.pin(false)}>
              <>
                <PinOff />
                Unpin
              </>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => row.pin('top')}>
              <>
                <Pin />
                Pin
              </>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <TaskSheet open={sheetOpen} onOpenChange={setSheetOpen} task={task} />
    </>
  );
}
