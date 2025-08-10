import { AlarmClockCheck, ArrowDown, ArrowRight, ArrowUp, CircleCheck, CircleX, LoaderCircle, LucideIcon } from 'lucide-react';
import { Moment } from 'moment';

export interface Task {
  task_id: string;
  title: string;
  label: 'bug' | 'feature' | 'documentation' | 'enhancement';
  status: 'todo' | 'in-progress' | 'done' | 'canceled';
  priority: 'low' | 'medium' | 'high';
  estimated_hours: number;
  created_at: Moment;
}

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
