import { isTupleOfTwoMoment } from '@/lib/check-type';
import { CalendarIcon, CircleX } from 'lucide-react';
import moment, { Moment } from 'moment';
import { Dispatch, SetStateAction } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
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
        <Calendar
          mode='range'
          required
          disabled={{ after: new Date() }}
          selected={
            dateRange === null
              ? { from: undefined, to: undefined }
              : moment.isMoment(dateRange)
                ? { from: dateRange.toDate(), to: dateRange.toDate() }
                : { from: dateRange[0].toDate(), to: dateRange[1].toDate() }
          }
          onSelect={(selected) => {
            if (!selected) return setDateRange(null);
            if (selected.from.toDateString() === selected.to.toDateString()) return setDateRange(moment(selected.to));
            return setDateRange([moment(selected.from), moment(selected.to)]);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
