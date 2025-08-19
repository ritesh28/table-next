import { Column, ColumnPinningPosition, Header, Table } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff, Tally1, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Task } from '@/model/task';
import { useEffect } from 'react';

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
        <div
          className={cn(
            'ml-auto -mr-2 hidden  group-hover:block',
            'absolute top-0 translate-y-1/3 right-0 select-none touch-none hover:cursor-ew-resize',
            column.getIsResizing() && 'bg-chart-2',
          )}
          onDoubleClick={() => column.resetSize()}
          onMouseDown={() => header.getResizeHandler()} // for desktop
          onTouchStart={() => header.getResizeHandler()} // for mobile
          style={{
            transform: header.column.getIsResizing() ? `translateX(${table.getState().columnSizingInfo.deltaOffset * -1}px)` : '',
          }}
        >
          <Tally1 strokeWidth={4} />
        </div>
      )}
    </div>
  );
}
