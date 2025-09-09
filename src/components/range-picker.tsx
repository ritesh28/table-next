'use client';

import { CirclePlus, CircleX } from 'lucide-react';

import { RangePickerInputNumber } from '@/components/range-picker-input-number';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { isTupleOfTwoNumber } from '@/lib/util-check-type';
import { useState } from 'react';

interface RangePickerProps {
  range: number | [number, number] | null;
  min: number;
  max: number;
  onRangeChange: (range: [number, number]) => void;
  onRemoveRange: () => void;
}
export function RangePicker({ range, min, max, onRangeChange, onRemoveRange }: RangePickerProps) {
  const [open, setOpen] = useState(false);

  const value_1 = range === null ? null : isTupleOfTwoNumber(range) ? range[0] : range;
  const value_2 = range === null ? null : isTupleOfTwoNumber(range) ? range[1] : range;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' aria-expanded={open} className='justify-between'>
          {range === null ? (
            <>
              <CirclePlus /> Est. Hours
            </>
          ) : (
            <div className='flex items-center gap-1'>
              <div className='hover:opacity-60' onClick={onRemoveRange}>
                <CircleX />
              </div>
              <span>Est. Hours</span>
              {typeof range === 'number' && <Badge>{range} hr</Badge>}
              {isTupleOfTwoNumber(range) && (
                <Badge>
                  <Badge>
                    {range[0]} - {range[1]} hr
                  </Badge>
                </Badge>
              )}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='w-[250px] p-1'>
        <div>Est. Hours</div>
        <div className='flex gap-4'>
          <RangePickerInputNumber min={min} max={max} value_1={value_1} value_2={value_2} onRangeChange={onRangeChange} isIcon />
        </div>
        <div className='my-4'>
          <Slider
            value={value_1 === null || value_2 === null ? [min, max] : [value_1, value_2]}
            min={min}
            max={max}
            step={1}
            onValueChange={(range) => onRangeChange([range[0], range[1]])}
          />
        </div>
        {range !== null && (
          <>
            <Separator />
            <Button variant='ghost' className='w-full' onClick={onRemoveRange}>
              Reset
            </Button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
