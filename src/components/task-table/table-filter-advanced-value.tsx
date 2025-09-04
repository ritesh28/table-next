import { DatePickerInputCalendar } from '@/components/date-picker-input-calendar';
import { RangePickerInputNumber } from '@/components/range-picker-input-number';
import { Input } from '@/components/ui/input';
import { isTupleOfTwoMoment, isTupleOfTwoNumber } from '@/lib/check-type';
import { UiForValue } from '@/model/table-filters';
import { isMoment } from 'moment';

interface DataTableFilterAdvancedValueProps {
  ui: UiForValue;
  value: unknown | null;
  setValue: (value: unknown | null) => void;
  minValue?: number;
  maxValue?: number;
}

export function DataTableFilterAdvancedValue({ ui, value, setValue, minValue, maxValue }: DataTableFilterAdvancedValueProps) {
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
      />
    );
  }
  if (ui === '2numericTextBox') {
    const variableMin = value === null ? minValue : isTupleOfTwoNumber(value) ? value[0] : Number(value);
    const variableMax = value === null ? maxValue : isTupleOfTwoNumber(value) ? value[1] : Number(value);
    return <RangePickerInputNumber min={minValue} max={maxValue} variableMin={variableMin} variableMax={variableMax} setRange={setValue} />;
  }
  if (ui === 'singleDate') {
    return <DatePickerInputCalendar dateRange={isMoment(value) ? value : null} setDateRange={setValue} calendarMode='single' />;
  }
  if (ui === 'rangeDate') {
    return (
      <DatePickerInputCalendar dateRange={isTupleOfTwoMoment(value) || isMoment(value) ? value : null} setDateRange={setValue} calendarMode='range' />
    );
  }
  if (ui === 'multiSelect') {
    // return (
    //   <div className='grid grid-cols-2 gap-2'>
    //     {Array.isArray(value) ? value.map((item) => <div key={item}>{String(item)}</div>) : <div>{String(value)}</div>}
    //   </div>
    // );
    return <div>multi select</div>;
  }
  return null;
}
