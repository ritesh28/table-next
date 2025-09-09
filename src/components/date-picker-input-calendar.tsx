import { Calendar } from '@/components/ui/calendar';
import { isTupleOfTwoMoment } from '@/lib/util-check-type';
import moment, { type Moment } from 'moment';

interface DatePickerInputCalendarProps {
  selectedDate: Moment | [Moment, Moment] | null;
  onDateSelect: (range: [Moment, Moment] | Moment) => void;
  calendarMode: 'single' | 'range';
}
export function DatePickerInputCalendar({ selectedDate, onDateSelect, calendarMode }: DatePickerInputCalendarProps) {
  if (calendarMode === 'single') {
    const date = selectedDate === null ? undefined : isTupleOfTwoMoment(selectedDate) ? selectedDate[0].toDate() : selectedDate.toDate();
    return (
      <Calendar
        mode='single'
        required
        disabled={{ after: new Date() }}
        defaultMonth={date}
        selected={date}
        onSelect={(selected) => onDateSelect(moment(selected))}
      />
    );
  }
  if (calendarMode === 'range') {
    const date =
      selectedDate === null
        ? { from: undefined, to: undefined }
        : moment.isMoment(selectedDate)
          ? { from: selectedDate.toDate(), to: selectedDate.toDate() }
          : { from: selectedDate[0].toDate(), to: selectedDate[1].toDate() };
    return (
      <Calendar
        mode='range'
        required
        disabled={{ after: new Date() }}
        defaultMonth={date.from}
        selected={date}
        onSelect={(selected) => {
          if (selected.from?.toDateString() === selected.to?.toDateString()) return onDateSelect(moment(selected.to));
          return onDateSelect([moment(selected.from), moment(selected.to)]);
        }}
      />
    );
  }
}
