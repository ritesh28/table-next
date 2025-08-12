'use client';

import { CirclePlus, CircleX, Timer } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InputWithIcon } from '@/components/ui/input-with-icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Table } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useState } from 'react';

interface RangePickerProps<TData> {
  table: Table<TData>;
  range: number[];
  setRange: Dispatch<SetStateAction<number[]>>;
  min: number;
  max: number;
}
export function RangePicker<TData>({ table, setRange, min, max }: RangePickerProps<TData>) {
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' aria-expanded={open} className='justify-between'>
          {selectedItems.length ? (
            <div className='flex items-center gap-1'>
              <div
                className='hover:opacity-60'
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedItems([]);
                }}
              >
                <CircleX />
              </div>
              <span>Est. Hours</span>
              {selectedItems.map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </div>
          ) : (
            <div className='flex items-center gap-1'>
              <CirclePlus />
              <span>Est. Hours</span>
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='w-[250px] p-1'>
        <div>Est. Hours</div>
        <div className='flex gap-4'>
          <InputWithIcon type='number' endIcon={Timer} placeholder='1' />
          <InputWithIcon type='number' endIcon={Timer} placeholder='12' />
        </div>
        <div className='my-4'>
          <Slider defaultValue={[min, max]} min={min} max={max} step={1} onValueChange={setRange} />
        </div>
        <Separator />
        <Button variant='ghost' className='w-full'>
          Reset
        </Button>
      </PopoverContent>
    </Popover>
  );
}
