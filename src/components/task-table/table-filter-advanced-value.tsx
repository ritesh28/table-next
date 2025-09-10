import { DatePickerInputCalendar } from '@/components/date-picker-input-calendar';
import { DataTableFilterAdvancedValueMulti } from '@/components/task-table/table-filter-advanced-value-multi';
import { DataTableFilterAdvancedValueRange } from '@/components/task-table/table-filter-advanced-value-range';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { isArrayOfString, isTupleOfTwoMoment, isTupleOfTwoNumber } from '@/lib/util-check-type';
import { UiVariantForValue } from '@/lib/util-filters';
import { Task } from '@/model/task';
import { CalendarIcon } from 'lucide-react';
import { isMoment } from 'moment';

interface DataTableFilterAdvancedValueProps {
  columnId: keyof Task;
  ui: UiVariantForValue;
  filterValue: unknown | null;
  onFilterValueChange: (filterValue: unknown | null) => void;
  disabled?: boolean;
}

export function DataTableFilterAdvancedValue({ columnId, ui, filterValue, onFilterValueChange, disabled }: DataTableFilterAdvancedValueProps) {
  if (ui === 'noUI') {
    return null;
  }
  if (ui === 'textBox') {
    return (
      <Input
        id='advanced-filter-text'
        placeholder='Search titles...'
        value={filterValue ? String(filterValue) : ''}
        onChange={(event) => onFilterValueChange(event.target.value ? event.target.value : null)}
        className='max-w-sm'
        disabled={disabled}
      />
    );
  }
  if (ui === 'numericTextBox') {
    return (
      <Input
        id='advanced-filter-number'
        type='number'
        placeholder='Enter a value...'
        value={Number(filterValue) || ''}
        onChange={(event) => onFilterValueChange(event.target.value ? Number(event.target.value) : null)}
        className='max-w-sm'
        disabled={disabled}
      />
    );
  }
  if (ui === '2numericTextBox') {
    if (isTupleOfTwoNumber(filterValue) || typeof filterValue === 'number' || filterValue === null)
      return <DataTableFilterAdvancedValueRange value={filterValue} onValueChange={onFilterValueChange} disabled={disabled} />;
    return null;
  }
  if (ui === 'singleDate') {
    return (
      <Popover>
        <PopoverTrigger asChild disabled={disabled}>
          <Button variant='outline' className='min-w-40'>
            <CalendarIcon /> {isMoment(filterValue) ? filterValue.format('ll') : 'Pick a date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent align='start' className='w-auto p-0'>
          <DatePickerInputCalendar
            selectedDate={isMoment(filterValue) ? filterValue : null}
            onDateSelect={onFilterValueChange}
            calendarMode='single'
          />
        </PopoverContent>
      </Popover>
    );
  }
  if (ui === 'rangeDate') {
    return (
      <Popover>
        <PopoverTrigger asChild disabled={disabled}>
          <Button variant='outline' className='min-w-40'>
            <CalendarIcon /> {isTupleOfTwoMoment(filterValue) ? `${filterValue[0].format('ll')} - ${filterValue[1].format('ll')}` : 'Pick a date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent align='start' className='w-auto p-0'>
          <DatePickerInputCalendar
            selectedDate={isTupleOfTwoMoment(filterValue) ? filterValue : null}
            onDateSelect={(range) => (isTupleOfTwoMoment(range) ? onFilterValueChange(range) : onFilterValueChange([range, range]))}
            calendarMode='range'
          />
        </PopoverContent>
      </Popover>
    );
  }
  if (ui === 'multiSelect') {
    if (isArrayOfString(filterValue) || filterValue === null)
      return <DataTableFilterAdvancedValueMulti columnId={columnId} values={filterValue} onValuesChange={onFilterValueChange} disabled={disabled} />;
    return null;
  }
  return null;
}
