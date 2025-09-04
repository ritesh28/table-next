import { DatePickerInputCalendar } from '@/components/date-picker-input-calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { isTupleOfTwoMoment } from '@/lib/check-type';
import { CalendarIcon, CircleX } from 'lucide-react';
import moment, { Moment } from 'moment';
import { Dispatch, SetStateAction } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface DatePickerProps {
  dateRange: Moment | [Moment, Moment] | null;
  setDateRange: Dispatch<SetStateAction<Moment | [Moment, Moment] | null>>;
}
export function DatePicker({ dateRange, setDateRange }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' className='justify-between'>
          {dateRange === null ? (
            <>
              <CalendarIcon /> Created At
            </>
          ) : (
            <div className='flex items-center gap-1'>
              <div className='hover:opacity-60' onClick={() => setDateRange(null)}>
                <CircleX />
              </div>
              <span>Created At</span>
              {moment.isMoment(dateRange) && <Badge>{dateRange.format('ll')}</Badge>}
              {isTupleOfTwoMoment(dateRange) && (
                <Badge>
                  {dateRange[0].format('ll')} - {dateRange[1].format('ll')}
                </Badge>
              )}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <DatePickerInputCalendar dateRange={dateRange} setDateRange={setDateRange} calendarMode='range' />
      </PopoverContent>
    </Popover>
  );
}
