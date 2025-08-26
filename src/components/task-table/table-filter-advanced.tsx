import { FILTER_COLUMN_ID } from '@/components/task-table/columns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FilterGroup } from '@/model/table-filter-group';
import { FilterGroupCollection } from '@/model/table-filter-group-collection';
import { Task } from '@/model/task';
import { Table } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
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
                  <p>FG AndOr</p>
                </div>
                <div
                  className='col-start-9'
                  style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart + 1 }}
                >
                  <p>FG X</p>
                </div>
                <div className='col-start-3' style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart }}>
                  <p>Field label</p>
                </div>
                <div className='col-start-4' style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart }}>
                  <p>Operator label</p>
                </div>
                <div className='col-start-5' style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart }}>
                  <p>Value label</p>
                </div>
                <div className='col-start-6' style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart }}>
                  <p>AndOr label</p>
                </div>
                {filterGroup.filters.map((filter, FilterIndex) => (
                  <Fragment key={FilterIndex}>
                    <div
                      className='col-start-3'
                      style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart + FilterIndex + 1 }}
                    >
                      <p>{filter.columnId}</p>
                    </div>
                    <div
                      className='col-start-4'
                      style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart + FilterIndex + 1 }}
                    >
                      <p>{filter.operator}</p>
                    </div>
                    <div
                      className='col-start-5'
                      style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart + FilterIndex + 1 }}
                    >
                      <p>{String(filter.value)}</p>
                    </div>
                    <div
                      className='col-start-6'
                      style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart + FilterIndex + 1 }}
                    >
                      <p>
                        {FilterIndex > 0 && 'disabled'} {filterGroup.filterListAndOr}
                      </p>
                    </div>
                    <div
                      className='col-start-7'
                      style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart + FilterIndex + 1 }}
                    >
                      <p>+</p>
                    </div>
                    <div
                      className='col-start-8'
                      style={{ gridRowStart: getFilterGroupGridRow(filterGroupCollection, filterGroupIndex).gridRowStart + FilterIndex + 1 }}
                    >
                      <p>-</p>
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
