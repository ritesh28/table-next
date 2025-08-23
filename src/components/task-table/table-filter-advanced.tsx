import { FILTER_COLUMN_ID } from '@/components/task-table/columns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FilterGroup, FilterGroupCollection } from '@/model/table-filter';
import { Task } from '@/model/task';
import { Table } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { Fragment, useCallback } from 'react';

interface DataTableFilterAdvanceProps {
  table: Table<Task>;
}
function getFilterGroupGridRowSpanStyle(filterGroupCollection: FilterGroupCollection, filterGroupIndex: number) {
  let totalPreviousFilters = 0;
  for (let index = 0; index < filterGroupIndex; index++) {
    totalPreviousFilters += filterGroupCollection.filterGroups[index].filters.length;
    totalPreviousFilters += 1; // for <hr/>
  }
  const gridRowStart = totalPreviousFilters + 1;
  const gridRowEnd = gridRowStart + filterGroupCollection.filterGroups[filterGroupIndex].filters.length;
  return { gridRowStart, gridRowEnd };
}

export function DataTableFilterAdvanced({ table }: DataTableFilterAdvanceProps) {
  const filterGroupCollection = table.getColumn(FILTER_COLUMN_ID).getFilterValue() as FilterGroupCollection | undefined;

  const addFilterGroup = useCallback(() => {
    const filterGroup = new FilterGroup('advanced').addDefaultFilter();
    const newFilterGroupCollection = filterGroupCollection.addNewFilterGroup(filterGroup);
    table.getColumn(FILTER_COLUMN_ID).setFilterValue(newFilterGroupCollection);
  }, [table, filterGroupCollection]);

  if (!filterGroupCollection) {
    return null;
  }

  return (
    <div>
      <Card>
        <CardContent>
          <div className='grid grid-cols-9 gap-1'>
            {filterGroupCollection.filterGroups.map((filterGroup, filterGroupIndex) => (
              <Fragment key={filterGroupIndex}>
                <div className='col-start-1 self-center' style={{ ...getFilterGroupGridRowSpanStyle(filterGroupCollection, filterGroupIndex) }}>
                  <p>Filter Group {filterGroupIndex + 1}</p>
                </div>
                {filterGroup.filters.map((filter, FilterIndex) => (
                  <Fragment key={FilterIndex}>
                    <div className='col-start-2' style={{ ...getFilterGroupGridRowSpanStyle(filterGroupCollection, filterGroupIndex) }}>
                      {filterGroupIndex > 0 && filterGroup.filterListAndOr && (
                        <>
                          <p>And/Or</p>
                          <Button>{filterGroupCollection.filterGroupListAndOr}</Button>
                        </>
                      )}
                    </div>
                    <div className='col-start-3'>
                      {FilterIndex == 0 && <p>Field</p>}
                      <Button>{filter.columnId}</Button>
                    </div>
                    <div>
                      {FilterIndex == 0 && <p>Operator</p>}
                      <Button>{filter.operator}</Button>
                    </div>
                    <div>
                      {FilterIndex == 0 && <p>Value</p>}
                      <Button>{'value' in filter ? String(filter.value) : ''}</Button>
                    </div>
                    <div>
                      {FilterIndex == 0 && <p>And/Or</p>}
                      <Button>{filterGroup.filterListAndOr}</Button>
                    </div>
                    <Button onClick={() => filterGroup.addDefaultFilter()}>+</Button>
                    <Button>-</Button>
                  </Fragment>
                ))}
                <div className='col-start-9' style={{ ...getFilterGroupGridRowSpanStyle(filterGroupCollection, filterGroupIndex) }}>
                  <Button>x</Button>
                </div>

                <div className='col-span-full'>
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
