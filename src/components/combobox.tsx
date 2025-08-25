'use client';

import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Dispatch, ReactNode, SetStateAction, useCallback, useState } from 'react';

export interface ComboboxItem {
  id: string;
  content: ReactNode;
  totalCount?: number;
}

interface ComboboxProps {
  items: ComboboxItem[];
  selectedItems: string[] | null;
  setSelectedItems: Dispatch<SetStateAction<string[] | null>>;
  isMultiSelect: boolean;
  buttonClassName?: string;
  buttonChildren: ReactNode;
  popoverContentClassName?: string;
  searchPlaceholder?: string;
  emptySearchString?: string;
  includeClearButton?: boolean;
}
export function Combobox({
  items,
  selectedItems,
  setSelectedItems,
  isMultiSelect,
  buttonClassName,
  buttonChildren,
  popoverContentClassName,
  searchPlaceholder,
  emptySearchString,
  includeClearButton,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);

  const handleItemSelect = useCallback(
    (itemId: string) => {
      if (isMultiSelect) {
        // check if the item is already selected. If so, unselect it
        if (selectedItems && selectedItems.includes(itemId)) {
          setSelectedItems((oldVals) => oldVals.filter((val) => val !== itemId));
        } else {
          setSelectedItems((oldVals) => (oldVals ? [...oldVals, itemId] : [itemId]));
        }
      } else {
        if (selectedItems || selectedItems.includes(itemId)) {
          setSelectedItems(null);
        } else {
          setSelectedItems([itemId]);
        }
        setOpen(false);
      }
    },
    [isMultiSelect, selectedItems, setSelectedItems],
  );

  const handleClearSelection = useCallback(() => {
    setSelectedItems(null);
    setOpen(false);
  }, [setSelectedItems]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' role='combobox' aria-expanded={open} className={cn('justify-between', buttonClassName)}>
          {buttonChildren}
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className={cn('w-[200px] p-0', popoverContentClassName)}>
        <Command>
          <CommandInput placeholder={searchPlaceholder ? searchPlaceholder : 'Search...'} className='h-9' />
          <CommandList>
            <CommandEmpty>{emptySearchString ? emptySearchString : 'No results found.'}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem key={item.id} value={item.id} onSelect={(id) => handleItemSelect(id)}>
                  {isMultiSelect && <Checkbox checked={selectedItems && selectedItems.includes(item.id)} />}
                  {!isMultiSelect && item.totalCount !== undefined && (
                    <Check className={cn('mr-1', selectedItems.includes(item.id) ? 'opacity-100' : 'opacity-0')} />
                  )}
                  {item.content}
                  {item.totalCount !== undefined && <p className='ml-auto'>{item.totalCount}</p>}
                  {item.totalCount === undefined && !isMultiSelect && (
                    <Check className={cn('ml-auto', selectedItems.includes(item.id) ? 'opacity-100' : 'opacity-0')} />
                  )}
                </CommandItem>
              ))}
              {includeClearButton && selectedItems && selectedItems.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandItem onSelect={handleClearSelection}>
                    <p className='w-full py-1 text-center'>Clear Selection</p>
                  </CommandItem>
                </>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
