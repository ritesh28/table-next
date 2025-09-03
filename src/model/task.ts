import { FILTER_TYPES } from '@/model/table-filters';
import { AlarmClockCheck, ArrowDown, ArrowRight, ArrowUp, CircleCheck, CircleX, LoaderCircle, LucideIcon } from 'lucide-react';
import moment from 'moment';
import { ReactNode } from 'react';
import * as z from 'zod';

// make label, status, priority, est hour optional
export const TaskSchema = z.object({
  task_id: z.string(),
  title: z.string(),
  label: z.enum(['bug', 'feature', 'documentation', 'enhancement']),
  status: z.enum(['todo', 'in-progress', 'done', 'canceled']),
  priority: z.enum(['low', 'medium', 'high']),
  estimated_hours: z.coerce.number().min(1),
  created_at: z.string().transform((val, ctx) => {
    try {
      const m = moment(val, "'DD/MM/YYYY'");
      if (!m.isValid()) throw Error(`${val} should be of format DD/MM/YYYY`);
      return m;
    } catch (e) {
      ctx.issues.push({
        code: 'custom',
        input: val,
        message: (e as Error).message,
      });
    }
  }),
});
export type Task = z.infer<typeof TaskSchema>;
export type SerializableTask = z.input<typeof TaskSchema>;

export const STATUS_ORDER: Record<Task['status'], number> = {
  todo: 3,
  'in-progress': 2,
  done: 1,
  canceled: 0,
} as const;

export const PRIORITY_ORDER: Record<Task['priority'], number> = {
  low: 0,
  medium: 1,
  high: 2,
} as const;

export const STATUS_ICON: Record<Task['status'], LucideIcon> = {
  todo: AlarmClockCheck,
  'in-progress': LoaderCircle,
  done: CircleCheck,
  canceled: CircleX,
} as const;

export const PRIORITY_ICON: Record<Task['priority'], LucideIcon> = {
  low: ArrowDown,
  medium: ArrowRight,
  high: ArrowUp,
} as const;

export const COLUMN_METADATA = {
  task_id: {
    columnId: 'task_id',
    content: 'Task ID',
    sortable: false,
    advancedFilterable: true,
    filterType: ['string'],
  },
  title: {
    columnId: 'title',
    content: 'Title',
    sortable: true,
    advancedFilterable: true,
    filterType: ['string'],
  },
  status: {
    columnId: 'status',
    content: 'Status',
    sortable: true,
    advancedFilterable: true,
    filterType: ['list', 'empty'],
  },
  priority: {
    columnId: 'priority',
    content: 'Priority',
    sortable: true,
    advancedFilterable: true,
    filterType: ['list', 'empty'],
  },
  label: {
    columnId: 'label',
    content: 'Label',
    sortable: false,
    advancedFilterable: true,
    filterType: ['list', 'empty'],
  },
  estimated_hours: {
    columnId: 'estimated_hours',
    content: 'Est. Hours',
    sortable: true,
    advancedFilterable: true,
    filterType: ['number', 'numberRange', 'empty'],
  },
  created_at: {
    columnId: 'created_at',
    content: 'Created At',
    sortable: true,
    advancedFilterable: true,
    filterType: ['date', 'dateRange', 'dateRelative'],
  },
} as const satisfies Readonly<
  Record<
    keyof Task,
    {
      columnId: keyof Task;
      content: ReactNode;
      sortable: boolean;
      advancedFilterable: boolean;
      filterType: (keyof typeof FILTER_TYPES)[];
    }
  >
>;
