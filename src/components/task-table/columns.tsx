'use client';

import { PRIORITY_ICONS, PRIORITY_ORDER, STATUS_ICONS, STATUS_ORDER, Task } from '@/model/task';
import { ColumnDef, Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { DataTableColumnHeader } from '@/components/task-table/column-header';
import { DataTableColumnHeaderCheckbox } from '@/components/task-table/column-header-checkbox';
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
import { FilterGroupCollection } from '@/lib/util-filter-group-collection';
import { Badge } from '../ui/badge';

export const columns: ColumnDef<Task>[] = [
  {
    id: 'select',
    header: ({ table, column }) => <DataTableColumnHeaderCheckbox table={table} column={column} />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' />,
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    size: 30,
  },
  {
    accessorKey: 'task_id',
    header: ({ table, header, column }) => (
      <DataTableColumnHeader table={table} header={header} column={column} title='Task ID' pinningPosition='left' />
    ),
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
    enableResizing: false,
    size: 90,
  },
  {
    accessorKey: 'title',
    header: ({ table, header, column }) => <DataTableColumnHeader table={table} header={header} column={column} title='Title' />,
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
    minSize: 300,
    maxSize: 1000,
    enableResizing: true,
  },
  {
    accessorKey: 'status',
    header: ({ table, header, column }) => <DataTableColumnHeader table={table} header={header} column={column} title='Status' />,
    cell: ({ row }) => {
      const { status } = row.original;
      const Icon = STATUS_ICONS[status];
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
      if (STATUS_ORDER[statusA] > STATUS_ORDER[statusB]) return 1;
      return 0;
    },
    size: 125,
    enableResizing: false,
  },
  {
    accessorKey: 'priority',
    header: ({ table, header, column }) => <DataTableColumnHeader table={table} header={header} column={column} title='Priority' />,
    cell: ({ row }) => {
      const { priority } = row.original;
      const Icon = PRIORITY_ICONS[priority];
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
      if (PRIORITY_ORDER[priorityA] > PRIORITY_ORDER[priorityB]) return 1;
      return 0;
    },
    size: 100,
    enableResizing: false,
  },
  {
    accessorKey: 'estimated_hours',
    header: ({ table, header, column }) => <DataTableColumnHeader table={table} header={header} column={column} title='Est. Hours' />,
    cell: ({ row }) => {
      const { estimated_hours } = row.original;
      return <p className='text-right pr-6'>{estimated_hours}</p>;
    },
    size: 120,
    enableResizing: false,
  },
  {
    accessorKey: 'created_at',
    header: ({ table, header, column }) => <DataTableColumnHeader table={table} header={header} column={column} title='Created At' />,
    cell: ({ row }) => {
      const { created_at } = row.original;
      return <div className='px-3'>{created_at?.format('ll')}</div>;
    },
    size: 120,
    enableResizing: false,
  },
  {
    id: 'actions',
    header: ({ table, header, column }) => <DataTableColumnHeader table={table} header={header} column={column} title='' pinningPosition='right' />,
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
    enableResizing: false,
    size: 40,
  },
];

export const FILTER_COLUMN_ID = 'task_id'; // this value is random. To be used when calling `tableWholesomeFilter()`

function tableWholesomeFilter(row: Row<Task>, _columnId: string, filterGroupCollection: FilterGroupCollection | undefined) {
  // this is the only filter function. This filter for all parameters
  // caters all possible scenarios
  // NOT using the global filter since that function is called for every column

  if (!filterGroupCollection) return true;

  let showRow: boolean | null = null;
  for (let filterGroup of filterGroupCollection.filterGroups) {
    let overallFilterResult: boolean | null = null;
    for (let filter of filterGroup.filters) {
      const currentFilterResult = filter.filterRow(row.original);
      if (overallFilterResult === null) {
        overallFilterResult = currentFilterResult;
        continue;
      }
      switch (filterGroup.filterListAndOr) {
        case 'And':
          overallFilterResult = overallFilterResult && currentFilterResult;
          break;
        case 'Or':
          overallFilterResult = overallFilterResult || currentFilterResult;
          break;
        default:
          throw new Error('filterGroup.filterListAndOr is not resolved');
      }
      if (!overallFilterResult && filterGroup.filterListAndOr === 'And') {
        // no meaning to continue since it will always return false
        break;
      }
    }
    if (showRow === null) {
      showRow = overallFilterResult;
      continue;
    }
    switch (filterGroupCollection.filterGroupListAndOr) {
      case 'And':
        showRow = showRow && overallFilterResult;
        break;
      case 'Or':
        showRow = showRow || overallFilterResult;
        break;
      default:
        throw new Error('filterGroupCollection.filterGroupListAndOr is not resolved');
    }
    if (!showRow && filterGroupCollection.filterGroupListAndOr === 'And') {
      // no meaning to continue since it will always return false
      break;
    }
  }
  return showRow ?? true;
}
