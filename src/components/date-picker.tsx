import { CalendarIcon, CircleX } from 'lucide-react';
import moment, { Moment } from 'moment';
import { Dispatch, SetStateAction } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface DatePickerProps {
  dateRange: Moment[];
  setDateRange: Dispatch<SetStateAction<Moment[]>>;
}
export function DatePicker({ dateRange, setDateRange }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' className='justify-between'>
          {dateRange.length === 2 ? (
            <div className='flex items-center gap-1'>
              <div className='hover:opacity-60' onClick={() => setDateRange([])}>
                <CircleX />
              </div>
              <span>Created At</span>

              {dateRange[0].isSame(dateRange[1], 'day') ? (
                <Badge>{dateRange[0].format('ll')}</Badge>
              ) : (
                <Badge>
                  {dateRange[0].format('ll')} - {dateRange[1].format('ll')}
                </Badge>
              )}
            </div>
          ) : (
            <>
              <CalendarIcon /> Created At
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='range'
          required
          disabled={{ after: new Date() }}
          selected={{ from: dateRange[0]?.toDate() ?? undefined, to: dateRange[1]?.toDate() ?? undefined }}
          onSelect={(selected) => {
            // make sure moment[0] is past to moment[1]
            if (selected.from.getTime() <= selected.to.getTime()) return setDateRange([moment(selected.from), moment(selected.to)]);
            return setDateRange([moment(selected.to), moment(selected.from)]);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
