import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { LABEL_ICONS, PRIORITY_ICONS, STATUS_ICONS, Task } from '@/model/task';
import { Calendar } from 'lucide-react';
import { Badge } from './ui/badge';
import { InputWithIcon } from './ui/input-with-icon';

interface TaskSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
}

export function TaskSheet({ open, onOpenChange, task }: TaskSheetProps) {
  const IconLabel = LABEL_ICONS[task.label];
  const IconStatus = STATUS_ICONS[task.status];
  const IconPriority = PRIORITY_ICONS[task.priority];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* radix issue. It adds adds pointer-events: none; for a controlled component */}
      {/* link: https://github.com/shadcn-ui/ui/issues/1859 */}
      {/* solution: add onCloseAutoFocus={() => (document.body.style.pointerEvents = '') */}
      <SheetContent aria-describedby={undefined} onCloseAutoFocus={() => (document.body.style.pointerEvents = '')}>
        <SheetHeader>
          <SheetTitle>Task Details</SheetTitle>
        </SheetHeader>
        <div className='grid flex-1 auto-rows-min gap-6 px-4'>
          <div className='grid gap-3'>
            <Label htmlFor='task-task-id-view'>Task Id</Label>
            <Input id='task-task-id-view' value={task.task_id} disabled />
          </div>
          <div className='grid gap-3'>
            <Label htmlFor='task-title-view'>Title</Label>
            <Textarea id='task-title-view' value={task.title} disabled />
          </div>
          <div className='flex gap-5'>
            <span>Label</span>
            <Badge>
              <IconLabel />
              <span>{task.label}</span>
            </Badge>
          </div>
          <div className='flex gap-5'>
            <span>Status</span>
            <Badge>
              <IconStatus />
              <span>{task.status}</span>
            </Badge>
          </div>
          <div className='flex gap-5'>
            <span>Priority</span>
            <Badge>
              <IconPriority />
              <span>{task.priority}</span>
            </Badge>
          </div>
          <div className='grid gap-3'>
            <Label htmlFor='task-est-hours-view'>Est. Hours</Label>
            <Input id='task-est-hours-view' value={task.estimated_hours} disabled />
          </div>
          <div className='grid gap-3'>
            <Label htmlFor='task-created-at-view'>Created At</Label>
            <InputWithIcon id='task-created-at-view' startIcon={Calendar} value={task.created_at?.format('ll')} disabled />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
