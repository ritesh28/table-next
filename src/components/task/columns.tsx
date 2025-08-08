'use client';

import { Task } from '@/model/task';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import moment from 'moment';

import { DataTableColumnHeader } from '@/components/task/column-header';
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

export const columns: ColumnDef<Task>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'task_id',
    header: () => <div className='text-right'>Task ID</div>,
    cell: ({ row }) => {
      return <div className='text-right font-medium'>{row.getValue('task_id')}</div>;
    },
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const { title, label } = row.original;
      return (
        <div className='text-right font-medium'>
          {label} {title[0].toUpperCase() + title.substring(1)}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
  },
  {
    accessorKey: 'estimated_hours',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
  },
  {
    accessorKey: 'created_at',
    cell: ({ row }) => {
      const created_at = (row.getValue('created_at') as string).trim();
      const formatted_date = moment(created_at, 'DD/MM/YYYY').format('ll');
      return <div className='text-right font-medium'>{formatted_date}</div>;
    },
  },
  {
    id: 'actions',
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
  },
];
