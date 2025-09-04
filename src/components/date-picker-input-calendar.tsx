import { Calendar } from '@/components/ui/calendar';
import moment, { type Moment } from 'moment';
import { Dispatch, SetStateAction } from 'react';

interface DatePickerInputCalendarProps {
  dateRange: Moment | [Moment, Moment] | null;
  setDateRange: Dispatch<SetStateAction<Moment | [Moment, Moment] | null>>;
  calendarMode: 'single' | 'range';
}
export function DatePickerInputCalendar({ dateRange, setDateRange, calendarMode }: DatePickerInputCalendarProps) {
  if (calendarMode === 'single') {
    return (
      <Calendar
        mode='single'
        required
        disabled={{ after: new Date() }}
        selected={dateRange === null ? undefined : (dateRange as Moment).toDate()}
        onSelect={(selected) => {
          if (!selected) return setDateRange(null);
          setDateRange(moment(selected));
        }}
      />
    );
  }
  if (calendarMode === 'range') {
    return (
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
    );
  }
}
