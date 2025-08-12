import { Column, ColumnPinningPosition } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Task } from '@/model/task';
import { useEffect } from 'react';

interface DataTableColumnHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<Task>;
  title: string;
  pinningPosition?: ColumnPinningPosition;
}

export function DataTableColumnHeader({ column, title, className, pinningPosition = false }: DataTableColumnHeaderProps) {
  useEffect(() => {
    column.pin(pinningPosition);
  }, [column, pinningPosition]);

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='sm' className='data-[state=open]:bg-accent h-8'>
            <span>{title}</span>
            {column.getIsSorted() === 'desc' ? <ArrowDown /> : column.getIsSorted() === 'asc' ? <ArrowUp /> : <ChevronsUpDown />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start'>
          {column.getIsSorted() !== 'asc' && (
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <ArrowUp />
              Asc
            </DropdownMenuItem>
          )}
          {column.getIsSorted() !== 'desc' && (
            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <ArrowDown />
              Desc
            </DropdownMenuItem>
          )}
          {column.getIsSorted() !== false && (
            <DropdownMenuItem onClick={() => column.clearSorting()}>
              <X />
              Reset
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
