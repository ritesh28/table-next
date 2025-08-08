export interface Task {
  task_id: string;
  title: string;
  label: 'bug' | 'feature' | 'documentation' | 'enhancement';
  status: 'todo' | 'in-progress' | 'done' | 'canceled';
  priority: 'low' | 'medium' | 'high';
  estimated_hours: number;
  created_at: string;
}
