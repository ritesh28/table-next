import { useCallback, useState } from 'react';

export function useCombobox(initialSelectedItems: string[] | null, isMultiSelect: boolean) {
  const [selectedItems, setSelectedItems] = useState<string[] | null>(initialSelectedItems);

  const handleItemSelect = useCallback(
    (itemId: string) => {
      if (isMultiSelect) {
        if (selectedItems?.includes(itemId)) {
          // check if the item is already selected. If so, unselect it
          setSelectedItems((oldVals) => (oldVals ? oldVals.filter((val) => val !== itemId) : null));
        } else {
          setSelectedItems((oldVals) => (oldVals ? [...oldVals, itemId] : [itemId]));
        }
      } else {
        setSelectedItems([itemId]);
      }
    },
    [isMultiSelect, selectedItems],
  );

  const handleClearSelection = useCallback(() => {
    setSelectedItems(null);
  }, []);

  const handleNewSelection = useCallback((newSelection: string[]) => {
    setSelectedItems((oldItems) => {
      if (oldItems === null) return newSelection;
      const oldSet = new Set(oldItems);
      const newSet = new Set(newSelection);
      const symmetricDiff = newSet.symmetricDifference(oldSet);
      return symmetricDiff.size === 0 ? oldItems : newSelection;
    });
  }, []);

  return { selectedItems, handleItemSelect, handleNewSelection, handleClearSelection };
}
