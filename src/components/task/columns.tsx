'use client';

import { PRIORITY_ICON, PRIORITY_ORDER, STATUS_ICON, STATUS_ORDER, Task } from '@/model/task';
import { ColumnDef, Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

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
import { FilterEmpty, FilterList, ModelFilterGroups } from '@/model/table-filter';
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
    filterFn: tableWholesomeFilter,
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
    sortingFn: (rowA, rowB, _) => {
      const statusA = rowA.original.status;
      const statusB = rowB.original.status;
      if (STATUS_ORDER[statusA] < STATUS_ORDER[statusB]) return -1;
      if (STATUS_ORDER[statusA] === STATUS_ORDER[statusB]) return 0;
      if (STATUS_ORDER[statusA] > STATUS_ORDER[statusB]) return 1;
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
    sortingFn: (rowA, rowB, _) => {
      const priorityA = rowA.original.priority;
      const priorityB = rowB.original.priority;
      if (PRIORITY_ORDER[priorityA] < PRIORITY_ORDER[priorityB]) return -1;
      if (PRIORITY_ORDER[priorityA] === PRIORITY_ORDER[priorityB]) return 0;
      if (PRIORITY_ORDER[priorityA] > PRIORITY_ORDER[priorityB]) return 1;
    },
    size: 100,
  },
  {
    accessorKey: 'estimated_hours',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Est. Hours' />,
    cell: ({ row }) => {
      const { estimated_hours } = row.original;
      return <p className='text-right pr-6'>{estimated_hours}</p>;
    },
    size: 120,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Created At' />,
    cell: ({ row }) => {
      const { created_at } = row.original;
      return <div className='px-3'>{created_at.format('ll')}</div>;
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
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
];

export const FILTER_COLUMN_ID = 'task_id';

function tableWholesomeFilter(row: Row<Task>, _columnId: string, filterGroups: ModelFilterGroups) {
  // this is the only filter function. This filter for all parameters
  // caters all possible scenarios
  const { task_id, title, label, status, priority, estimated_hours, created_at } = row.original;

  let showRow = true;
  for (let filterGroup of filterGroups.filterGroups) {
    let filterGroupResult = true;
    for (let filter of filterGroup.filters) {
      let filterResult = true;
      switch (filter.field) {
        case 'status':
          if ('values' in filter) {
            filter = filter as FilterList;
            if (filter.operator === 'has any of') filterResult = filter.values.includes(status);
            else if (filter.operator === 'has none of') filterResult = !filter.values.includes(status);
          } else {
            filter = filter as FilterEmpty;
            if (filter.operator === 'is empty') filterResult = !!status;
            else if (filter.operator === 'is not empty') filterResult = !status;
          }
          break;
        case 'priority':
          if ('values' in filter) {
            filter = filter as FilterList;
            if (filter.operator === 'has any of') filterResult = filter.values.includes(priority);
            else if (filter.operator === 'has none of') filterResult = !filter.values.includes(priority);
          } else {
            filter = filter as FilterEmpty;
            if (filter.operator === 'is empty') filterResult = !!priority;
            else if (filter.operator === 'is not empty') filterResult = !priority;
          }
          break;
        // todo
        default:
          throw new Error('filter.field is not resolved');
      }
      switch (filterGroup.filterListAndOr) {
        case false:
          filterGroupResult = filterResult;
          break;
        case 'And':
          filterGroupResult = filterGroupResult && filterResult;
          break;
        case 'Or':
          filterGroupResult = filterGroupResult || filterResult;
          break;
        default:
          throw new Error('filterGroup.andOr is not resolved');
      }
      if (!filterGroupResult && filterGroup.filterListAndOr === 'And') {
        // no meaning to continue since it will always return false
        break;
      }
    }
    switch (filterGroups.filterGroupListAndOr) {
      case false:
        showRow = filterGroupResult;
        break;
      case 'And':
        showRow = showRow && filterGroupResult;
        break;
      case 'Or':
        showRow = showRow || filterGroupResult;
        break;
      default:
        throw new Error('filterGroups.andOr is not resolved');
    }
    if (!showRow && filterGroups.filterGroupListAndOr === 'And') {
      // no meaning to continue since it will always return false
      break;
    }
  }
  return showRow;
}
