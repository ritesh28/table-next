import { FILTER_VARIANTS } from '@/lib/util-filters';
import {
  AlarmClockCheck,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Book,
  Bug,
  CircleCheck,
  CircleX,
  Lightbulb,
  LoaderCircle,
  LucideIcon,
  Star,
} from 'lucide-react';
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

export const STATUS_ICONS: Record<Task['status'], LucideIcon> = {
  todo: AlarmClockCheck,
  'in-progress': LoaderCircle,
  done: CircleCheck,
  canceled: CircleX,
} as const;

export const PRIORITY_ICONS = {
  low: ArrowDown,
  medium: ArrowRight,
  high: ArrowUp,
} as const satisfies Record<Task['priority'], LucideIcon>;

export const LABEL_ICONS = {
  bug: Bug,
  feature: Star,
  documentation: Book,
  enhancement: Lightbulb,
} as const satisfies Record<Task['label'], LucideIcon>;

export const COLUMN_METADATA = {
  task_id: {
    columnId: 'task_id',
    content: 'Task ID',
    sortable: false,
    advancedFilterable: true,
    filterVariant: ['string'],
  },
  title: {
    columnId: 'title',
    content: 'Title',
    sortable: true,
    advancedFilterable: true,
    filterVariant: ['string'],
  },
  status: {
    columnId: 'status',
    content: 'Status',
    sortable: true,
    advancedFilterable: true,
    filterVariant: ['list', 'empty'],
  },
  priority: {
    columnId: 'priority',
    content: 'Priority',
    sortable: true,
    advancedFilterable: true,
    filterVariant: ['list', 'empty'],
  },
  label: {
    columnId: 'label',
    content: 'Label',
    sortable: false,
    advancedFilterable: true,
    filterVariant: ['list', 'empty'],
  },
  estimated_hours: {
    columnId: 'estimated_hours',
    content: 'Est. Hours',
    sortable: true,
    advancedFilterable: true,
    filterVariant: ['number', 'numberRange', 'empty'],
  },
  created_at: {
    columnId: 'created_at',
    content: 'Created At',
    sortable: true,
    advancedFilterable: true,
    filterVariant: ['date', 'dateRange', 'dateRelative'],
  },
} as const satisfies Readonly<
  Record<
    keyof Task,
    {
      columnId: keyof Task;
      content: ReactNode;
      sortable: boolean;
      advancedFilterable: boolean;
      filterVariant: (keyof typeof FILTER_VARIANTS)[];
    }
  >
>;
