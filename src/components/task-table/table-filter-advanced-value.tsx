import { DatePickerInputCalendar } from '@/components/date-picker-input-calendar';
import { DataTableFilterAdvancedValueRange } from '@/components/task-table/table-filter-advanced-value-range';
import { Input } from '@/components/ui/input';
import { isArrayOfString, isTupleOfTwoMoment, isTupleOfTwoNumber } from '@/lib/check-type';
import { UiForValue } from '@/model/table-filters';
import { Task } from '@/model/task';
import { isMoment } from 'moment';
import { Dispatch, SetStateAction } from 'react';
import { DataTableFilterAdvancedValueMulti } from './table-filter-advanced-value-multi';

interface DataTableFilterAdvancedValueProps {
  columnId: keyof Task;
  ui: UiForValue;
  value: unknown | null;
  setValue: Dispatch<SetStateAction<unknown | null>>;
  disabled?: boolean;
}

export function DataTableFilterAdvancedValue({ columnId, ui, value, setValue, disabled }: DataTableFilterAdvancedValueProps) {
  if (ui === 'noUI') {
    return null;
  }
  if (ui === 'textBox') {
    return (
      <Input
        id='advanced-filter-text'
        placeholder='Search titles...'
        value={value ? String(value) : ''}
        onChange={(event) => setValue(event.target.value ? event.target.value : null)}
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
        value={Number(value) || ''}
        onChange={(event) => setValue(event.target.value ? Number(event.target.value) : null)}
        className='max-w-sm'
        disabled={disabled}
      />
    );
  }
  if (ui === '2numericTextBox') {
    if (isTupleOfTwoNumber(value) || typeof value === 'number' || value === null)
      return <DataTableFilterAdvancedValueRange value={value} setValue={setValue} disabled={disabled} />;
    return null;
  }
  if (ui === 'singleDate') {
    // todo: disable
    return <DatePickerInputCalendar dateRange={isMoment(value) ? value : null} setDateRange={setValue} calendarMode='single' />;
  }
  if (ui === 'rangeDate') {
    return (
      <DatePickerInputCalendar dateRange={isTupleOfTwoMoment(value) || isMoment(value) ? value : null} setDateRange={setValue} calendarMode='range' />
    );
  }
  if (ui === 'multiSelect') {
    if (isArrayOfString(value) || value === null)
      return <DataTableFilterAdvancedValueMulti columnId={columnId} value={value} setValue={setValue} disabled={disabled} />;
    return null;
  }
  return null;
}
