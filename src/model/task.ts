import { AlarmClockCheck, ArrowDown, ArrowRight, ArrowUp, CircleCheck, CircleX, LoaderCircle, LucideIcon } from 'lucide-react';
import moment from 'moment';
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
