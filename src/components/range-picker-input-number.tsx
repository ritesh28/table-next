import { InputWithIcon } from '@/components/ui/input-with-icon';
import { isTupleOfTwoNumber } from '@/lib/check-type';
import { Timer } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface RangePickerInputNumberProps {
  min: number;
  max: number;
  variableMin: number;
  variableMax: number;
  setRange: Dispatch<SetStateAction<number | [number, number] | null>>;
  isIcon?: boolean;
  disabled?: boolean;
}

export function RangePickerInputNumber({ min, max, variableMin, variableMax, setRange, isIcon, disabled }: RangePickerInputNumberProps) {
  return (
    <>
      <InputWithIcon
        type='number'
        endIcon={isIcon ? Timer : undefined}
        disabled={disabled}
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
        endIcon={isIcon ? Timer : undefined}
        disabled={disabled}
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
    </>
  );
}
