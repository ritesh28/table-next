import { AlarmClockCheck, ArrowDown, ArrowRight, ArrowUp, CircleCheck, CircleX, LoaderCircle, LucideIcon } from 'lucide-react';

export interface Task {
  task_id: string;
  title: string;
  label: 'bug' | 'feature' | 'documentation' | 'enhancement';
  status: 'todo' | 'in-progress' | 'done' | 'canceled';
  priority: 'low' | 'medium' | 'high';
  estimated_hours: number;
  created_at: string;
}

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
