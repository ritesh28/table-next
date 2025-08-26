'use client';

import { CirclePlus, CircleX, Timer } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InputWithIcon } from '@/components/ui/input-with-icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { isTupleOfTwoNumber } from '@/lib/check-type';
import { Dispatch, SetStateAction, useState } from 'react';

interface RangePickerProps {
  range: number | [number, number] | null;
  setRange: Dispatch<SetStateAction<number | [number, number] | null>>;
  min: number;
  max: number;
}
export function RangePicker({ range, setRange, min, max }: RangePickerProps) {
  const [open, setOpen] = useState(false);

  const variableMin = range === null ? min : isTupleOfTwoNumber(range) ? range[0] : range;
  const variableMax = range === null ? max : isTupleOfTwoNumber(range) ? range[1] : range;

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
              <div className='hover:opacity-60' onClick={() => setRange(null)}>
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
          <InputWithIcon
            type='number'
            endIcon={Timer}
            min={min}
            max={variableMax}
            value={variableMin}
            onChange={(e) =>
              setRange((oldRange) => {
                const value = parseInt(e.target.value, 10);
                const newVal2 = oldRange === null ? max : isTupleOfTwoNumber(oldRange) ? oldRange[1] : oldRange;
                const newVal1 = Number.isNaN(value) || value > newVal2 || value < min ? variableMin : value;
                return newVal1 === newVal2 ? newVal1 : [newVal1, newVal2];
              })
            }
          />
          <InputWithIcon
            type='number'
            endIcon={Timer}
            min={variableMin}
            max={max}
            value={variableMax}
            onChange={(e) =>
              setRange((oldRange) => {
                const newVal1 = oldRange === null ? min : isTupleOfTwoNumber(oldRange) ? oldRange[0] : oldRange;
                const value = parseInt(e.target.value, 10);
                const newVal2 = Number.isNaN(value) || value < newVal1 || value > max ? variableMax : value;
                return newVal1 === newVal2 ? newVal1 : [newVal1, newVal2];
              })
            }
          />
        </div>
        <div className='my-4'>
          <Slider
            value={[variableMin, variableMax]}
            min={min}
            max={max}
            step={1}
            onValueChange={(range) => {
              const val1 = range[0];
              const val2 = range[1];
              if (val1 === val2) return setRange(val1);
              return setRange([val1, val2]);
            }}
          />
        </div>
        {isTupleOfTwoNumber(range) && (
          <>
            <Separator />
            <Button variant='ghost' className='w-full' onClick={() => setRange(null)}>
              Reset
            </Button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
