'use client';

import { PRIORITY_ICON, STATUS_ICON, Task } from '@/model/task';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import moment from 'moment';

import { DataTableColumnHeader } from '@/components/task/column-header';
import { DataTableColumnHeaderCheckbox } from '@/components/task/column-header-checkbox';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '../ui/badge';

export const columns: ColumnDef<Task>[] = [
  {
    id: 'select',
    header: ({ table, column }) => <DataTableColumnHeaderCheckbox table={table} column={column} />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' />,
    enableSorting: false,
    enableHiding: false,
    size: 30,
  },
  {
    accessorKey: 'task_id',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Task ID' pinningPosition='left' />,
    cell: ({ row }) => {
      const { task_id } = row.original;
      const startPart = task_id.slice(0, -5);
      const endPart = task_id.slice(-5);
      return (
        <Tooltip delayDuration={200}>
          <TooltipTrigger>...{endPart}</TooltipTrigger>
          <TooltipContent>
            <p>
              {startPart}
              <span className='text-green-300'>{endPart}</span>
            </p>
          </TooltipContent>
        </Tooltip>
      );
    },
    enableSorting: false,
    enableHiding: false,
    size: 90,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Title' />,
    cell: ({ row }) => {
      const { title, label } = row.original;
      return (
        <p className='overflow-hidden whitespace-nowrap text-ellipsis'>
          <Badge asChild>
            <span className='mr-2'>{label}</span>
          </Badge>
          {title}
        </p>
      );
    },
    size: 800,
    minSize: 500,
    maxSize: 1000,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({ row }) => {
      const { status } = row.original;
      const Icon = STATUS_ICON[status];
      return (
        <Badge>
          <Icon />
          <span className='ml-1'>{status}</span>
        </Badge>
      );
    },
    size: 125,
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Priority' />,
    cell: ({ row }) => {
      const { priority } = row.original;
      const Icon = PRIORITY_ICON[priority];
      return (
        <Badge>
          <Icon />
          <span className='ml-1'>{priority}</span>
        </Badge>
      );
    },
    size: 100,
  },
  {
    accessorKey: 'estimated_hours',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Est. Hours' />,
    cell: ({ row }) => {
      const { estimated_hours } = row.original;
      return <p className='px-3'>{estimated_hours}</p>;
    },
    size: 120,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Created At' />,
    cell: ({ row }) => {
      const created_at = (row.getValue('created_at') as string).trim();
      const formatted_date = moment(created_at, 'DD/MM/YYYY').format('ll');
      return <div className='px-3'>{formatted_date}</div>;
    },
    size: 120,
  },
  {
    id: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title='' pinningPosition='right' />,
    cell: ({ row }) => {
      const task = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(task.task_id)}>Copy Task ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 40,
  },
];
