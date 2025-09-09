import { Combobox, ComboboxItem } from '@/components/combobox';
import { FILTER_COLUMN_ID } from '@/components/task-table/columns';
import { DataTableFilterAdvancedValue } from '@/components/task-table/table-filter-advanced-value';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AndOr, FilterGroup } from '@/model/table-filter-group';
import { FilterGroupCollection } from '@/model/table-filter-group-collection';
import { Filter, FILTER_VARIANTS } from '@/model/table-filters';
import { COLUMN_METADATA, Task } from '@/model/task';
import { Table } from '@tanstack/react-table';
import { ChevronsUpDown, Minus, Plus, X } from 'lucide-react';
import { Fragment, useCallback } from 'react';

const ADVANCED_FILTER_COLUMNS = Object.values(COLUMN_METADATA)
  .filter((col) => col.advancedFilterable)
  .map((col) => ({ id: col.columnId, content: col.content }));

const COLUMN_FILTER_TYPE_MAP = Object.fromEntries(Object.values(COLUMN_METADATA).map((col) => [col.columnId, col.filterVariant]));

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

const OPERATOR_TYPE_LIMITER = '*****';

export function DataTableFilterAdvanced({ table }: DataTableFilterAdvanceProps) {
  const filterGroupCollection = table.getColumn(FILTER_COLUMN_ID)?.getFilterValue() as FilterGroupCollection | undefined;

  const addNewFilterGroup = useCallback(() => {
    table.getColumn(FILTER_COLUMN_ID)?.setFilterValue((oldFilterGroupCollection: FilterGroupCollection | undefined) => {
      const filterClass = FILTER_VARIANTS[COLUMN_FILTER_TYPE_MAP.title[0]];
      const filter = new filterClass('title', filterClass.OPERATOR_LIST[0]);
      const filterGroup = new FilterGroup('advanced', [filter]);
      const newFilterGroupCollection = (oldFilterGroupCollection ?? new FilterGroupCollection()).addNewFilterGroup(filterGroup);
      return newFilterGroupCollection;
    });
  }, [table]);

  const updateFilterColumn = useCallback(
    (columnId: keyof Task, filterGroupIndex: number, filterIndex: number) => {
      table.getColumn(FILTER_COLUMN_ID)?.setFilterValue((oldFilterGroupCollection: FilterGroupCollection) => {
        const filterClass = FILTER_VARIANTS[COLUMN_FILTER_TYPE_MAP[columnId][0]];
        const newFilter = new filterClass(columnId, filterClass.OPERATOR_LIST[0]);
        return FilterGroupCollection.replaceFilterInFilterGroup(oldFilterGroupCollection, newFilter, filterGroupIndex, filterIndex);
      });
    },
    [table],
  );

  const updateFilterOperator = useCallback(
    (filterGroupIndex: number, filterIndex: number, operator: string, filterVariant: keyof typeof FILTER_VARIANTS) => {
      table.getColumn(FILTER_COLUMN_ID)?.setFilterValue((oldFilterGroupCollection: FilterGroupCollection) => {
        const oldFilter = oldFilterGroupCollection?.filterGroups[filterGroupIndex].filters[filterIndex];
        const newFilter = new FILTER_VARIANTS[filterVariant](oldFilter.columnId, operator); // for a given column id, filter can be be of multiple types
        return FilterGroupCollection.replaceFilterInFilterGroup(oldFilterGroupCollection, newFilter, filterGroupIndex, filterIndex);
      });
    },
    [table],
  );

  const updateFilterValue = useCallback(
    (filterGroupIndex: number, filterIndex: number, value: unknown) => {
      table.getColumn(FILTER_COLUMN_ID)?.setFilterValue((oldFilterGroupCollection: FilterGroupCollection) => {
        const oldFilter = oldFilterGroupCollection?.filterGroups[filterGroupIndex].filters[filterIndex];
        const newFilter = oldFilter.setValueAndReturnNewFilter(value);
        return FilterGroupCollection.replaceFilterInFilterGroup(oldFilterGroupCollection, newFilter, filterGroupIndex, filterIndex);
      });
    },
    [table],
  );

  return (
    <div>
      <Card className='shadow-xs overflow-x-auto'>
        <CardContent>
          <div className='grid grid-cols-[10rem_6rem_12rem_14rem_18rem_6rem_3rem_3rem_1fr] gap-3'>
            {filterGroupCollection?.filterGroups.map((filterGroup, filterGroupIndex) => (
              <Fragment key={filterGroupIndex}>
                <div
                  className='col-start-1'
                  style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart + 1 }}
                >
                  <p>
                    Filter Group {filterGroupIndex + 1}{' '}
                    {filterGroup.isSimpleFilterGroup && <span className='text-sm text-muted-foreground'>[Simple]</span>}
                  </p>
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
                          ?.setFilterValue((oldFilterGroupCollection: FilterGroupCollection) => oldFilterGroupCollection.setFilterGroupListAndOr(val))
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
                  className='col-start-9 justify-self-end px-2'
                  style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart + 1 }}
                >
                  <Button
                    variant='destructive'
                    size='icon'
                    onClick={() =>
                      table
                        .getColumn(FILTER_COLUMN_ID)
                        ?.setFilterValue((oldFilterGroupCollection: FilterGroupCollection) =>
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
                      <Combobox
                        disabled={filterGroup.isSimpleFilterGroup}
                        buttonClassName='w-full'
                        popoverContentClassName='w-full'
                        items={[...ADVANCED_FILTER_COLUMNS]}
                        selectedItems={[filter.columnId]}
                        handleItemSelect={(newColumnId) => updateFilterColumn(newColumnId as keyof Task, filterGroupIndex, filterIndex)}
                        isMultiSelect={false}
                        buttonChildren={
                          <div className='w-full flex items-center justify-between'>
                            <span>{ADVANCED_FILTER_COLUMNS.find((afc) => afc.id === filter.columnId)?.content ?? 'Select Column'}</span>
                            <ChevronsUpDown />
                          </div>
                        }
                      />
                    </div>
                    <div
                      className='col-start-4'
                      style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart + filterIndex + 1 }}
                    >
                      <Combobox
                        disabled={filterGroup.isSimpleFilterGroup}
                        buttonClassName='w-full'
                        popoverContentClassName='w-full'
                        items={COLUMN_FILTER_TYPE_MAP[filter.columnId].reduce((accumulator, filterVariant) => {
                          return [
                            ...accumulator,
                            ...FILTER_VARIANTS[filterVariant].OPERATOR_LIST.map((op: string) => ({
                              id: op + OPERATOR_TYPE_LIMITER + filterVariant,
                              content: op[0].toUpperCase() + op.substring(1),
                              groupHeading: FILTER_VARIANTS[filterVariant].OPERATOR_GROUP_NAME,
                            })),
                          ];
                        }, [] as ComboboxItem[])}
                        selectedItems={[filter.operator]}
                        handleItemSelect={(item) => {
                          const [operator, filterVariant] = item.split(OPERATOR_TYPE_LIMITER) as [string, keyof typeof FILTER_VARIANTS];
                          updateFilterOperator(filterGroupIndex, filterIndex, operator, filterVariant);
                        }}
                        isMultiSelect={false}
                        buttonChildren={
                          <div className='w-full flex items-center justify-between text-ellipsis'>
                            <span>{filter.operator || 'Select Operator...'}</span>
                            <ChevronsUpDown />
                          </div>
                        }
                      />
                    </div>
                    <div
                      className='col-start-5'
                      style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart + filterIndex + 1 }}
                    >
                      <DataTableFilterAdvancedValue
                        columnId={filter.columnId}
                        ui={(filter.constructor as typeof Filter<unknown>).UI_VARIANT_FOR_VALUE}
                        filterValue={filter.value}
                        onFilterValueChange={(value) => updateFilterValue(filterGroupIndex, filterIndex, value)}
                        disabled={filterGroup.isSimpleFilterGroup}
                      />
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
                            ?.setFilterValue((oldFilterGroupCollection: FilterGroupCollection) =>
                              FilterGroupCollection.setFilterListAndOr(oldFilterGroupCollection, filterGroupIndex, val),
                            )
                        }
                      >
                        <SelectTrigger className='w-[75px]' disabled={filterGroup.isSimpleFilterGroup}>
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
                      <Button
                        disabled={filterGroup.isSimpleFilterGroup}
                        variant='outline'
                        size='icon'
                        onClick={() =>
                          table.getColumn(FILTER_COLUMN_ID)?.setFilterValue((oldFilterGroupCollection: FilterGroupCollection) => {
                            const filterClass = FILTER_VARIANTS[COLUMN_FILTER_TYPE_MAP['title'][0]];
                            const newFilter = new filterClass('title', filterClass.OPERATOR_LIST[0]);
                            return FilterGroupCollection.addFilterInFilterGroup(oldFilterGroupCollection, newFilter, filterGroupIndex);
                          })
                        }
                      >
                        <Plus />
                      </Button>
                    </div>
                    <div
                      className='col-start-8'
                      style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart + filterIndex + 1 }}
                    >
                      <Button
                        disabled={filterGroup.isSimpleFilterGroup}
                        variant='outline'
                        size='icon'
                        onClick={() =>
                          table
                            .getColumn(FILTER_COLUMN_ID)
                            ?.setFilterValue((oldFilterGroupCollection: FilterGroupCollection) =>
                              FilterGroupCollection.removeFilterFromFilterGroup(oldFilterGroupCollection, filterGroupIndex, filterIndex),
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
          <Button onClick={addNewFilterGroup}>
            <Plus /> <span>Add Filter Group</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
