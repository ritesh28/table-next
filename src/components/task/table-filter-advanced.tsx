import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table } from '@tanstack/react-table';
import { Fragment } from 'react';

interface DataTableFilterAdvanceProps<TData> {
  table: Table<TData>;
}

interface Filters {
  field: string;
  operator: string;
  value: string;
  andOr: false | 'And' | 'Or';
}
interface FilterGroup {
  name: string;
  canCancel: boolean;
  isEditable: boolean;
  andOr: false | 'And' | 'Or';
  filters: Filters[];
}

const filterGroups: FilterGroup[] = [
  {
    name: 'Filter Group 1',
    canCancel: false,
    isEditable: false,
    andOr: false,
    filters: [
      { field: 'Department', operator: '=', value: 'HouseKeeping', andOr: 'And' },
      { field: 'Assignee', operator: '=', value: 'Ritesh', andOr: false },
    ],
  },
  {
    name: 'Filter Group 2',
    canCancel: true,
    isEditable: true,
    andOr: 'Or',
    filters: [{ field: 'Department', operator: '=', value: 'HouseKeeping', andOr: false }],
  },
];

function getFilterGroupGridRowSpanStyle(filterGroups: FilterGroup[], filterGroupIndex: number) {
  let totalPreviousFilters = 0;
  for (let index = 0; index < filterGroupIndex; index++) {
    totalPreviousFilters += filterGroups[index].filters.length;
    totalPreviousFilters += 1; // for <hr/>
  }
  const gridRowStart = totalPreviousFilters + 1;
  const gridRowEnd = gridRowStart + filterGroups[filterGroupIndex].filters.length;
  return { gridRowStart, gridRowEnd };
}

export function DataTableFilterAdvanced<TData>({ table }: DataTableFilterAdvanceProps<TData>) {
  return (
    <div>
      <Card>
        <CardContent>
          <div className='grid grid-cols-9 gap-1'>
            {filterGroups.map((filterGroup, filterGroupIndex) => (
              <Fragment key={filterGroup.name}>
                <div className='col-start-1' style={{ ...getFilterGroupGridRowSpanStyle(filterGroups, filterGroupIndex) }}>
                  <p>{filterGroup.name}</p>
                </div>

                {filterGroup.filters.map((filter, FilterIndex) => (
                  <Fragment key={FilterIndex}>
                    <div className='col-start-2' style={{ ...getFilterGroupGridRowSpanStyle(filterGroups, filterGroupIndex) }}>
                      {filterGroup.andOr && FilterIndex == 0 && (
                        <>
                          <p>And/Or</p>
                          <Button>{filterGroup.andOr}</Button>
                        </>
                      )}
                    </div>
                    <div className='col-start-3'>
                      {FilterIndex == 0 && <p>Field</p>}
                      <Button>{filter.field}</Button>
                    </div>
                    <div>
                      {FilterIndex == 0 && <p>Operator</p>}
                      <Button>{filter.operator}</Button>
                    </div>
                    <div>
                      {FilterIndex == 0 && <p>Value</p>}
                      <Button>{filter.value}</Button>
                    </div>
                    <div>
                      {FilterIndex == 0 && <p>And/Or</p>}
                      <Button disabled={filter.andOr === false}>{filter.andOr}</Button>
                    </div>
                    <Button>+</Button>
                    <Button>-</Button>
                  </Fragment>
                ))}
                <div className='col-start-9' style={{ ...getFilterGroupGridRowSpanStyle(filterGroups, filterGroupIndex) }}>
                  <Button>x</Button>
                </div>
                {filterGroupIndex !== filterGroups.length - 1 && (
                  <div className='col-span-full'>
                    <hr />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
