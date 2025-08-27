import { Combobox } from '@/components/combobox';
import { FILTER_COLUMN_ID } from '@/components/task-table/columns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AndOr, FilterGroup } from '@/model/table-filter-group';
import { FilterGroupCollection } from '@/model/table-filter-group-collection';
import { SORTABLE_COLUMNS, Task } from '@/model/task';
import { Table } from '@tanstack/react-table';
import { ChevronsUpDown, Minus, Plus, X } from 'lucide-react';
import { Fragment, useCallback } from 'react';

interface DataTableFilterAdvanceProps {
  table: Table<Task>;
}
function getFilterGroupGridRow(filterGroupCollection: FilterGroupCollection, filterGroupIndex: number) {
  function getRowCount(filterGroupIndex: number) {
    let count = filterGroupCollection.filterGroups[filterGroupIndex].filters.length;
    count += 1; // for top label - field, operator , etc
    count += 1; // for bottom <hr/>
    return count;
  }

  let totalPreviousFilters = 0;
  for (let index = 0; index < filterGroupIndex; index++) {
    totalPreviousFilters += getRowCount(index);
  }
  const gridRowStart = totalPreviousFilters + 1;
  const gridRowEnd = gridRowStart + getRowCount(filterGroupIndex);
  return { gridRowStart, gridRowEnd };
}

export function DataTableFilterAdvanced({ table }: DataTableFilterAdvanceProps) {
  const filterGroupCollection = table.getColumn(FILTER_COLUMN_ID).getFilterValue() as FilterGroupCollection | undefined;

  const addFilterGroup = useCallback(() => {
    const filterGroup = new FilterGroup('advanced').addDefaultFilter();
    const newFilterGroupCollection = (filterGroupCollection ?? new FilterGroupCollection()).addNewFilterGroup(filterGroup);
    table.getColumn(FILTER_COLUMN_ID).setFilterValue(newFilterGroupCollection);
  }, [table, filterGroupCollection]);

  return (
    <div>
      <Card>
        <CardContent>
          <div className='grid grid-cols-9 gap-1'>
            {filterGroupCollection?.filterGroups.map((filterGroup, filterGroupIndex) => (
              <Fragment key={filterGroupIndex}>
                <div
                  className='col-start-1'
                  style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart + 1 }}
                >
                  <p>Filter Group {filterGroupIndex + 1}</p>
                </div>
                <div
                  className='col-start-2'
                  style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart + 1 }}
                >
                  {filterGroupIndex > 0 && (
                    <Select
                      disabled={filterGroupIndex !== 1}
                      value={(filterGroupCollection.filterGroupListAndOr === 'And' ? 'And' : 'Or') as AndOr}
                      onValueChange={(val: AndOr) =>
                        table
                          .getColumn(FILTER_COLUMN_ID)
                          .setFilterValue((oldFilterGroupCollection: FilterGroupCollection) => oldFilterGroupCollection.setFilterGroupListAndOr(val))
                      }
                    >
                      <SelectTrigger className='w-[75px]'>
                        <SelectValue placeholder={(filterGroupCollection.filterGroupListAndOr === 'And' ? 'And' : 'Or') as AndOr} />
                      </SelectTrigger>
                      <SelectContent className='!w-[75px]'>
                        {(['And', 'Or'] as AndOr[]).map((value) => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div
                  className='col-start-9'
                  style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart + 1 }}
                >
                  <Button
                    variant='destructive'
                    size='icon'
                    onClick={() =>
                      table
                        .getColumn(FILTER_COLUMN_ID)
                        .setFilterValue((oldFilterGroupCollection: FilterGroupCollection) =>
                          oldFilterGroupCollection.deleteFilterGroup(filterGroupIndex),
                        )
                    }
                  >
                    <X />
                  </Button>
                </div>
                <div className='col-start-3' style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart }}>
                  <p className='text-sm font-medium'>Column</p>
                </div>
                <div className='col-start-4' style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart }}>
                  <p className='text-sm font-medium'>Operator</p>
                </div>
                <div className='col-start-5' style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart }}>
                  <p className='text-sm font-medium'>Value(s)</p>
                </div>
                <div className='col-start-6' style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart }}>
                  <p className='text-sm font-medium'>And / Or</p>
                </div>
                {filterGroup.filters.map((filter, filterIndex) => (
                  <Fragment key={filterIndex}>
                    <div
                      className='col-start-3'
                      style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart + filterIndex + 1 }}
                    >
                      <p>{}</p>
                      <Combobox
                        buttonClassName='w-[175px]'
                        popoverContentClassName='w-[175px]'
                        items={[...SORTABLE_COLUMNS]}
                        selectedItems={[filter.columnId]}
                        // setSelectedItems={(newIds) => handleUpdateSort(columnSort.id, newIds[0])}
                        setSelectedItems={() => {}}
                        isMultiSelect={false}
                        buttonChildren={
                          <div className='w-full flex items-center justify-between'>
                            <span>{SORTABLE_COLUMNS.find((sc) => sc.id === filter.columnId).content}</span>
                            <ChevronsUpDown />
                          </div>
                        }
                      />
                    </div>
                    <div
                      className='col-start-4'
                      style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart + filterIndex + 1 }}
                    >
                      <p>{filter.operator}</p>
                    </div>
                    <div
                      className='col-start-5'
                      style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart + filterIndex + 1 }}
                    >
                      <p>{String(filter.value)}</p>
                    </div>
                    <div
                      className='col-start-6'
                      style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart + filterIndex + 1 }}
                    >
                      <Select
                        disabled={filterIndex > 0}
                        value={(filterGroup.filterListAndOr === 'And' ? 'And' : 'Or') as AndOr}
                        onValueChange={(val: AndOr) =>
                          table
                            .getColumn(FILTER_COLUMN_ID)
                            .setFilterValue((oldFilterGroupCollection: FilterGroupCollection) =>
                              FilterGroupCollection.setFilterListAndOr(oldFilterGroupCollection, filterGroupIndex, val),
                            )
                        }
                      >
                        <SelectTrigger className='w-[75px]'>
                          <SelectValue placeholder={(filterGroup.filterListAndOr === 'And' ? 'And' : 'Or') as AndOr} />
                        </SelectTrigger>
                        <SelectContent className='!w-[75px]'>
                          {(['And', 'Or'] as AndOr[]).map((value) => (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div
                      className='col-start-7'
                      style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart + filterIndex + 1 }}
                    >
                      <p>+</p>
                    </div>
                    <div
                      className='col-start-8'
                      style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart + filterIndex + 1 }}
                    >
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() =>
                          table
                            .getColumn(FILTER_COLUMN_ID)
                            .setFilterValue((oldFilterGroupCollection: FilterGroupCollection) =>
                              FilterGroupCollection.removeColumnFilterFromFilterGroup(oldFilterGroupCollection, filterGroupIndex, filterIndex),
                            )
                        }
                      >
                        <Minus />
                      </Button>
                    </div>
                  </Fragment>
                ))}
                <div
                  className='col-span-full my-2'
                  style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowEnd - 1 }}
                >
                  <hr />
                </div>
              </Fragment>
            ))}
          </div>
          {/* todo */}
          <Button onClick={addFilterGroup}>
            <Plus /> <span>Add Filter Group</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
