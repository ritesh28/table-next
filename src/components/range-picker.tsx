'use client';

import { CirclePlus, CircleX, Timer } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InputWithIcon } from '@/components/ui/input-with-icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Dispatch, SetStateAction, useState } from 'react';

interface RangePickerProps {
  range: number[];
  setRange: Dispatch<SetStateAction<number[]>>;
  min: number;
  max: number;
}
export function RangePicker({ range, setRange, min, max }: RangePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' aria-expanded={open} className='justify-between'>
          {range.length ? (
            <div className='flex items-center gap-1'>
              <div className='hover:opacity-60' onClick={() => setRange([])}>
                <CircleX />
              </div>
              <span>Est. Hours</span>
              <Badge>
                {range[0]} - {range[1]} hr
              </Badge>
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
          <InputWithIcon
            type='number'
            endIcon={Timer}
            min={min}
            max={range[1] ?? max}
            value={range[0] ?? min}
            onChange={(e) =>
              setRange(([oldVal1, oldVal2]) => {
                const newVal2 = oldVal2 ?? max;
                const newVal1 = parseInt(e.target.value, 10);
                if (Number.isNaN(newVal1) || newVal1 > newVal2 || newVal1 < min) return [oldVal1, newVal2];
                return [newVal1, newVal2];
              })
            }
          />
          <InputWithIcon
            type='number'
            endIcon={Timer}
            min={range[0] ?? min}
            max={max}
            value={range[1] ?? max}
            onChange={(e) =>
              setRange(([oldVal1, oldVal2]) => {
                const newVal1 = oldVal1 ?? min;
                let newVal2 = parseInt(e.target.value, 10);
                if (Number.isNaN(newVal2) || newVal2 < newVal1 || newVal2 > max) return [newVal1, oldVal2];
                return [newVal1, newVal2];
              })
            }
          />
        </div>
        <div className='my-4'>
          <Slider value={[range[0] ?? min, range[1] ?? max]} min={min} max={max} step={1} onValueChange={setRange} />
        </div>
        {range.length > 0 && (
          <>
            <Separator />
            <Button variant='ghost' className='w-full' onClick={() => setRange([])}>
              Reset
            </Button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
