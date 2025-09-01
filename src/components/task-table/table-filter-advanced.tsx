import { Combobox, ComboboxItem } from '@/components/combobox';
import { FILTER_COLUMN_ID } from '@/components/task-table/columns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AndOr, FilterGroup } from '@/model/table-filter-group';
import { FilterGroupCollection } from '@/model/table-filter-group-collection';
import { FILTER_OPERATOR_TYPES, FilterPlaceholder } from '@/model/table-filters';
import { ADVANCED_FILTER_COLUMNS, COLUMN_FILTER_OPERATOR_MAP, Task } from '@/model/task';
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

const OPERATOR_TYPE_LIMITER = '*****';

export function DataTableFilterAdvanced({ table }: DataTableFilterAdvanceProps) {
  const filterGroupCollection = table.getColumn(FILTER_COLUMN_ID).getFilterValue() as FilterGroupCollection | undefined;

  const addNewFilterGroup = useCallback(() => {
    table.getColumn(FILTER_COLUMN_ID).setFilterValue((oldFilterGroupCollection: FilterGroupCollection | undefined) => {
      const filterGroup = new FilterGroup('advanced', [new FilterPlaceholder()]);
      const newFilterGroupCollection = (oldFilterGroupCollection ?? new FilterGroupCollection()).addNewFilterGroup(filterGroup);
      return newFilterGroupCollection;
    });
  }, [table]);

  const updateFilterColumn = useCallback(
    (columnId: keyof Task, filterGroupIndex: number, filterIndex: number) => {
      table.getColumn(FILTER_COLUMN_ID).setFilterValue((oldFilterGroupCollection: FilterGroupCollection) => {
        const filter = new FilterPlaceholder(columnId);
        return FilterGroupCollection.replaceFilterInFilterGroup(oldFilterGroupCollection, filter, filterGroupIndex, filterIndex);
      });
    },
    [table],
  );

  const updateFilterOperator = useCallback(
    (filterGroupIndex: number, filterIndex: number, operator: string, operatorType: keyof typeof FILTER_OPERATOR_TYPES) => {
      table.getColumn(FILTER_COLUMN_ID).setFilterValue((oldFilterGroupCollection: FilterGroupCollection) => {
        const oldFilter = oldFilterGroupCollection?.filterGroups[filterGroupIndex].filters[filterIndex];
        const newFilter = new FilterPlaceholder(oldFilter.columnId).setOperator(operator, operatorType);
        return FilterGroupCollection.replaceFilterInFilterGroup(oldFilterGroupCollection, newFilter, filterGroupIndex, filterIndex);
      });
    },
    [table],
  );

  //todo: disable simple filter group
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
                      <Combobox
                        disabled={filterGroup.isSimpleFilterGroup}
                        buttonClassName='w-[175px]'
                        popoverContentClassName='w-[175px]'
                        items={[...ADVANCED_FILTER_COLUMNS]}
                        selectedItems={[filter.columnId]}
                        setSelectedItems={(newIds) => updateFilterColumn(newIds[0], filterGroupIndex, filterIndex)}
                        isMultiSelect={false}
                        buttonChildren={
                          <div className='w-full flex items-center justify-between'>
                            <span>{ADVANCED_FILTER_COLUMNS.find((afc) => afc.id === filter.columnId).content}</span>
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
                        buttonClassName='w-[175px]'
                        popoverContentClassName='w-[175px]'
                        items={COLUMN_FILTER_OPERATOR_MAP[filter.columnId].reduce((accumulator, currentValue) => {
                          return [
                            ...accumulator,
                            ...FILTER_OPERATOR_TYPES[currentValue].operator.map((op: string) => ({
                              id: op + OPERATOR_TYPE_LIMITER + currentValue,
                              content: op[0].toUpperCase() + op.substring(1),
                              groupHeading: currentValue,
                            })),
                          ];
                        }, [] as ComboboxItem[])}
                        selectedItems={[filter.operator]}
                        setSelectedItems={(newIds) => {
                          const [operator, operatorType] = (newIds[0] as string).split(OPERATOR_TYPE_LIMITER) as [
                            string,
                            keyof typeof FILTER_OPERATOR_TYPES,
                          ];
                          updateFilterOperator(filterGroupIndex, filterIndex, operator, operatorType);
                        }}
                        isMultiSelect={false}
                        buttonChildren={
                          <div className='w-full flex items-center justify-between'>
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
                      <p>+</p>
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
                            .setFilterValue((oldFilterGroupCollection: FilterGroupCollection) =>
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
          {/* todo */}
          <Button onClick={addNewFilterGroup}>
            <Plus /> <span>Add Filter Group</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
