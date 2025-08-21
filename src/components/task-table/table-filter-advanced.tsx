import { FILTER_COLUMN_ID } from '@/components/task-table/columns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DEFAULT_MODEL_FILTER_GROUPS, ModelFilterGroups } from '@/model/table-filter';
import { Task } from '@/model/task';
import { Table } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { Fragment } from 'react';

interface DataTableFilterAdvanceProps {
  table: Table<Task>;
}
// todo - update to UIFilterGroups
// function getFilterGroupGridRowSpanStyle(filterGroups: UIFilterGroups, filterGroupIndex: number) {
function getFilterGroupGridRowSpanStyle(filterGroups: ModelFilterGroups, filterGroupIndex: number) {
  let totalPreviousFilters = 0;
  for (let index = 0; index < filterGroupIndex; index++) {
    totalPreviousFilters += filterGroups.filterGroups[index].filters.length;
    totalPreviousFilters += 1; // for <hr/>
  }
  const gridRowStart = totalPreviousFilters + 1;
  const gridRowEnd = gridRowStart + filterGroups.filterGroups[filterGroupIndex].filters.length;
  return { gridRowStart, gridRowEnd };
}

export function DataTableFilterAdvanced({ table }: DataTableFilterAdvanceProps) {
  const filterGroups = (table.getColumn(FILTER_COLUMN_ID).getFilterValue() ?? DEFAULT_MODEL_FILTER_GROUPS) as ModelFilterGroups;

  return (
    <div>
      <Card>
        <CardContent>
          <div className='grid grid-cols-9 gap-1'>
            {filterGroups.filterGroups.map((filterGroup, filterGroupIndex) => (
              <Fragment key={filterGroupIndex}>
                <div className='col-start-1 self-center' style={{ ...getFilterGroupGridRowSpanStyle(filterGroups, filterGroupIndex) }}>
                  <p>Filter Group {filterGroupIndex + 1}</p>
                </div>
                {filterGroup.filters.map((filter, FilterIndex) => (
                  <Fragment key={FilterIndex}>
                    <div className='col-start-2' style={{ ...getFilterGroupGridRowSpanStyle(filterGroups, filterGroupIndex) }}>
                      {filterGroup.filterListAndOr && FilterIndex == 0 && (
                        <>
                          <p>And/Or</p>
                          <Button>{filterGroups.filterGroupListAndOr}</Button>
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
                      <Button disabled={filterGroup.filterListAndOr === false}>{filterGroup.filterListAndOr}</Button>
                    </div>
                    <Button>+</Button>
                    <Button>-</Button>
                  </Fragment>
                ))}
                <div className='col-start-9' style={{ ...getFilterGroupGridRowSpanStyle(filterGroups, filterGroupIndex) }}>
                  <Button>x</Button>
                </div>

                <div className='col-span-full'>
                  <hr />
                </div>
              </Fragment>
            ))}
          </div>
          <Button>
            <Plus /> <span>Add Filter Group</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
