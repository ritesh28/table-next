import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Task } from '@/model/task';
import { Row } from '@tanstack/react-table';
import { Download, Pin, PinOff, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface DataTableRowSelectedActionProps {
  selectedRows: Row<Task>[];
}

function exportTasks(rows: Row<Task>[]) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0].original);
  const csvRows = [headers.join(','), ...rows.map((row) => headers.map((h) => JSON.stringify(row.original[h as keyof Task])).join(','))];
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Tasks.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export function DataTableRowSelectedAction({ selectedRows }: DataTableRowSelectedActionProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(selectedRows.length > 0);
  }, [selectedRows.length]);

  const anyPinned = selectedRows.some((row) => row.getIsPinned());

  return (
    <div className='relative mt-4'>
      <div
        className={cn(
          'absolute left-1/2 -translate-x-1/2 transition-all duration-300',
          visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none',
        )}
      >
        <Card className='rounded-sm py-1'>
          <CardContent className='flex items-center gap-2 px-2'>
            <Card className='rounded-sm py-0'>
              <CardContent className='flex items-center gap-2 px-2'>
                <div>{selectedRows.length} selected</div>
                <Separator orientation='vertical' className='self-stretch h-auto!' />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant='ghost' size='icon' onClick={() => selectedRows.map((row) => row.toggleSelected())} aria-label='Deselect all'>
                      <X />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear selection</p>
                  </TooltipContent>
                </Tooltip>
              </CardContent>
            </Card>
            <Separator orientation='vertical' className='self-stretch h-auto!' />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='secondary' size='icon' onClick={() => exportTasks(selectedRows)} aria-label='Export tasks'>
                  <Download />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export tasks</p>
              </TooltipContent>
            </Tooltip>
            {!anyPinned ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='secondary'
                    size='icon'
                    onClick={() => selectedRows.map((row) => row.pin('top'))}
                    className='flex items-center gap-2'
                  >
                    <Pin />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Pin</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='secondary'
                    size='icon'
                    onClick={() => selectedRows.map((row) => row.pin(false))}
                    className='flex items-center gap-2'
                  >
                    <PinOff />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Unpin</p>
                </TooltipContent>
              </Tooltip>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
