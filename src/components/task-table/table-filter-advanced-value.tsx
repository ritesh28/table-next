import { UiForValue } from '@/model/table-filters';

interface DataTableFilterAdvancedValueProps {
  value: unknown;
  ui: UiForValue;
}

export function DataTableFilterAdvancedValue({ value, ui }: DataTableFilterAdvancedValueProps) {
  console.log(ui);

  if (ui === 'noUI') {
    return null;
  }
  if (ui === 'textBox') {
    // return <input type='text' value={String(value)} readOnly />;
    return <div>textbox</div>;
  }
  if (ui === 'numericTextBox') {
    // return <input type='number' value={Number(value)} readOnly />;
    return <div>numeric textbox</div>;
  }
  if (ui === '2numericTextBox') {
    // return (
    //   <div className='grid grid-cols-2 gap-2'>
    //     <input type='number' value={Number(value[0])} readOnly />
    //     <input type='number' value={Number(value[1])} readOnly />
    //   </div>
    // );
    return <div>2 numeric textbox</div>;
  }
  if (ui === 'singleDate') {
    // return <input type='date' value={String(value)} readOnly />;
    return <div>single date</div>;
  }
  if (ui === 'rangeDate') {
    // return (
    //   <div className='grid grid-cols-2 gap-2'>
    //     <input type='date' value={String(value[0])} readOnly />
    //     <input type='date' value={String(value[1])} readOnly />
    //   </div>
    // );
    return <div>range date</div>;
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
