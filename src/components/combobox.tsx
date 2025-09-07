'use client';

import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Fragment, ReactNode, useState } from 'react';

export interface ComboboxItem {
  id: string;
  content: ReactNode;
  totalCount?: number;
  groupHeading?: ReactNode;
}

interface ComboboxProps {
  items: ComboboxItem[];
  selectedItems: string[] | null;
  handleItemSelect: (item: string) => void;
  handleClearSelection?: () => void;
  isMultiSelect: boolean;
  buttonClassName?: string;
  buttonChildren: ReactNode;
  popoverContentClassName?: string;
  searchPlaceholder?: string;
  emptySearchString?: string;
  disabled?: boolean;
}
export function Combobox({
  items,
  selectedItems,
  handleItemSelect,
  handleClearSelection,
  isMultiSelect,
  buttonClassName,
  buttonChildren,
  popoverContentClassName,
  searchPlaceholder = 'Search...',
  emptySearchString = 'No results found.',
  disabled,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);

  const groupHeadingMap: Record<string, ReactNode> = {};
  const groupedItems = Object.groupBy(items, ({ groupHeading }) => {
    const groupKey = groupHeading?.toString() ?? '';
    groupHeadingMap[groupKey] = groupHeading ?? '';
    return groupKey;
  });
  const groupedItemCount = Object.keys(groupedItems).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button variant='outline' role='combobox' aria-expanded={open} className={cn('justify-between', buttonClassName)}>
          {buttonChildren}
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className={cn('w-[200px] p-0', popoverContentClassName)}>
        <Command>
          <CommandInput placeholder={searchPlaceholder} className='h-9' />
          <CommandList>
            <CommandEmpty>{emptySearchString}</CommandEmpty>
            {Object.entries(groupedItems).map(([key, values], groupItemIndex) => (
              <Fragment key={key}>
                <CommandGroup heading={groupHeadingMap[key]}>
                  {values?.map((value) => (
                    <CommandItem
                      key={value.id}
                      value={value.id}
                      onSelect={(id) => {
                        handleItemSelect(id);
                        if (!isMultiSelect) setOpen(false);
                      }}
                    >
                      {isMultiSelect && <Checkbox checked={(selectedItems && selectedItems.includes(value.id)) ?? false} />}
                      {!isMultiSelect && value.totalCount !== undefined && (
                        <Check className={cn('mr-1', selectedItems && selectedItems.includes(value.id) ? 'opacity-100' : 'opacity-0')} />
                      )}
                      {value.content}
                      {value.totalCount !== undefined && <p className='ml-auto'>{value.totalCount}</p>}
                      {value.totalCount === undefined && !isMultiSelect && (
                        <Check className={cn('ml-auto', selectedItems && selectedItems.includes(value.id) ? 'opacity-100' : 'opacity-0')} />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
                {groupItemIndex < groupedItemCount - 1 && <CommandSeparator />}
              </Fragment>
            ))}
            {handleClearSelection && selectedItems && selectedItems.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      handleClearSelection();
                      setOpen(false);
                    }}
                  >
                    <p className='w-full py-1 text-center'>Clear Selection</p>
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
