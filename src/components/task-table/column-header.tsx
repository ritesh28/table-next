import { Column, ColumnPinningPosition, Header, Table } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff, Tally1, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Task } from '@/model/task';
import { useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface DataTableColumnHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<Task>;
  header: Header<Task, unknown>;
  column: Column<Task>;
  title: string;
  pinningPosition?: ColumnPinningPosition;
}

export function DataTableColumnHeader({ table, header, column, title, className, pinningPosition = false }: DataTableColumnHeaderProps) {
  useEffect(() => {
    column.pin(pinningPosition);
  }, [column, pinningPosition]);

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center gap-2 group', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='sm' className='data-[state=open]:bg-accent h-8'>
            <span>{title}</span>
            {column.getIsSorted() === 'desc' ? <ArrowDown /> : column.getIsSorted() === 'asc' ? <ArrowUp /> : <ChevronsUpDown />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start'>
          {column.getIsSorted() !== 'asc' && (
            <DropdownMenuItem onClick={() => column.toggleSorting(false, true)}>
              <ArrowUp />
              Asc
            </DropdownMenuItem>
          )}
          {column.getIsSorted() !== 'desc' && (
            <DropdownMenuItem onClick={() => column.toggleSorting(true, true)}>
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
      {column.getCanResize() && (
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <div
              className={cn(
                'absolute right-0 select-none touch-none hover:cursor-col-resize',
                column.getIsResizing() ? 'text-chart-2' : 'text-muted-foreground group-hover:text-foreground',
              )}
              onDoubleClick={() => column.resetSize()}
              onMouseDown={header.getResizeHandler()}
              onTouchStart={header.getResizeHandler()}
            >
              <Tally1 strokeWidth={2} viewBox='0 0 7 24' className='h-11' />
            </div>
          </TooltipTrigger>
          {table.getState().columnSizing[column.id] && !column.getIsResizing() && <TooltipContent>Double-click to reset size</TooltipContent>}
        </Tooltip>
      )}
    </div>
  );
}
