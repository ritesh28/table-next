import { InputWithIcon } from '@/components/ui/input-with-icon';
import { Timer } from 'lucide-react';

interface RangePickerInputNumberProps {
  min: number;
  max: number;
  value_1: number | null;
  value_2?: number | null;
  onRangeChange: (range: [number, number]) => void;
  isIcon?: boolean;
  disabled?: boolean;
}

export function RangePickerInputNumber({ min, max, value_1, value_2, onRangeChange, isIcon, disabled }: RangePickerInputNumberProps) {
  return (
    <>
      <InputWithIcon
        type='number'
        endIcon={isIcon ? Timer : undefined}
        disabled={disabled}
        min={min}
        max={value_2 ?? undefined}
        value={value_1 ?? ''}
        placeholder={String(min)}
        onChange={(e) => {
          const val1 = parseInt(e.target.value, 10);
          const val2 = value_2 ?? max;
          if (val1 <= val2 && val1 >= min) return onRangeChange([val1, val2]);
        }}
      />
      <InputWithIcon
        type='number'
        endIcon={isIcon ? Timer : undefined}
        disabled={disabled}
        min={value_1 ?? undefined}
        max={max}
        value={value_2 ?? ''}
        placeholder={String(max)}
        onChange={(e) => {
          const val1 = value_1 ?? min;
          const val2 = parseInt(e.target.value, 10);
          if (val1 <= val2 && val2 <= max) return onRangeChange([val1, val2]);
        }}
      />
    </>
  );
}
