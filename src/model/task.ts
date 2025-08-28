import {
  Filter,
  FilterDate,
  FilterDateOperator,
  FilterDateRange,
  FilterDateRangeOperator,
  FilterDateRelative,
  FilterDateRelativeOperator,
  FilterEmpty,
  FilterEmptyOperator,
  FilterList,
  FilterListOperator,
  FilterNumber,
  FilterNumberOperator,
  FilterNumberRange,
  FilterNumberRangeOperator,
  FilterString,
  FilterStringOperator,
} from '@/model/table-filters';
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

export const SORTABLE_COLUMNS = [
  {
    id: 'title',
    content: 'Title',
    order: 0,
  },
  {
    id: 'status',
    content: 'Status',
    order: 1,
  },
  {
    id: 'priority',
    content: 'Priority',
    order: 2,
  },
  {
    id: 'estimated_hours',
    content: 'Est. Hours',
    order: 3,
  },
  {
    id: 'created_at',
    content: 'Created At',
    order: 4,
  },
] as const satisfies Readonly<{ id: keyof Task; content: ReactNode; order: number }[]>;

export const SORTABLE_ORDERS = {
  asc: 'Asc',
  desc: 'Desc',
} as const;

export const ADVANCED_FILTER_COLUMNS = [
  { id: 'task_id', content: 'Task ID' },
  { id: 'title', content: 'Title' },
  { id: 'status', content: 'status' },
  { id: 'priority', content: 'Priority' },
  { id: 'label', content: 'Label' },
  { id: 'estimated_hours', content: 'Est. Hours' },
  { id: 'created_at', content: 'Created At' },
] as const satisfies Readonly<{ id: keyof Task; content: string }[]>;

export const ALL_FILTER_GROUPS = {
  Emptiness: {
    operator: FilterEmptyOperator,
    filterClass: FilterEmpty,
  },
  Text: {
    operator: FilterStringOperator,
    filterClass: FilterString,
  },
  Choice: {
    operator: FilterListOperator,
    filterClass: FilterList,
  },
  Numeric: {
    operator: FilterNumberOperator,
    filterClass: FilterNumber,
  },
  'Numeric Range': {
    operator: FilterNumberRangeOperator,
    filterClass: FilterNumberRange,
    // todo: add property to class for UI
  },
  Date: {
    operator: FilterDateOperator,
    filterClass: FilterDate,
  },
  'Date Range': {
    operator: FilterDateRangeOperator,
    filterClass: FilterDateRange,
  },
  'Date Relative': {
    operator: FilterDateRelativeOperator,
    filterClass: FilterDateRelative,
  },
} as const satisfies Readonly<Record<string, { operator: Readonly<string[]>; filterClass: typeof Filter<string, unknown> }>>;

export const COLUMN_FILTER_OPERATOR_MAP = {
  task_id: ['Text'],
  title: ['Text'],
  status: ['Choice', 'Emptiness'],
  priority: ['Choice', 'Emptiness'],
  label: ['Choice', 'Emptiness'],
  estimated_hours: ['Numeric', 'Numeric Range', 'Emptiness'],
  created_at: ['Date', 'Date Range', 'Date Relative'],
} as const satisfies Readonly<Record<keyof Task, (keyof typeof ALL_FILTER_GROUPS)[]>>;
