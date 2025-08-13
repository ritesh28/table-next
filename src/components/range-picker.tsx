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
              <div
                className='hover:opacity-60'
                onClick={(e) => {
                  e.preventDefault();
                  setRange([]);
                }}
              >
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
            placeholder={String(min)}
            min={min}
            max={range[1] ?? max}
            value={range[0] ?? ''}
            onChange={(e) => setRange(([_val1, val2]) => [parseInt(e.target.value, 10), val2 ?? max])}
            // todo: fix input min max boundary
          />
          <InputWithIcon
            type='number'
            endIcon={Timer}
            placeholder={String(max)}
            min={range[0] ?? min}
            max={max}
            value={range[1] ?? ''}
            onChange={(e) => setRange(([val1, _val2]) => [val1 ?? min, parseInt(e.target.value, 10)])}
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
