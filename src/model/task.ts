import { AlarmClockCheck, ArrowDown, ArrowRight, ArrowUp, CircleCheck, CircleX, LoaderCircle, LucideIcon } from 'lucide-react';
import moment from 'moment';
import { ReactNode } from 'react';
import * as z from 'zod';

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
};

export const PRIORITY_ORDER: Record<Task['priority'], number> = {
  low: 0,
  medium: 1,
  high: 2,
};

export const STATUS_ICON: Record<Task['status'], LucideIcon> = {
  todo: AlarmClockCheck,
  'in-progress': LoaderCircle,
  done: CircleCheck,
  canceled: CircleX,
};

export const PRIORITY_ICON: Record<Task['priority'], LucideIcon> = {
  low: ArrowDown,
  medium: ArrowRight,
  high: ArrowUp,
};

export const sortableColumns: { id: keyof Task; content: ReactNode; order: number }[] = [
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
] as const;

export const sortableOrders = [
  {
    id: 'asc',
    name: 'Asc',
  },
  {
    id: 'desc',
    name: 'Desc',
  },
] as const;
