// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
import { UIFilterGroups } from '@/model/table-filter';
import { Task } from '@/model/task';
import { Table } from '@tanstack/react-table';
// import { Fragment } from 'react';

interface DataTableFilterAdvanceProps {
  table: Table<Task>;
}

// const filterGroups: UIFilterGroups = {
//   filterGroupListAndOr: 'And',
//   filterGroups: [
//     {
//       name: 'Filter Group 1',
//       canCancel: false,
//       isEditable: false,
//       filterListAndOr: 'And',
//       filters: [
//         { field: 'Department', _operator: 'is', value: 'HouseKeeping' },
//         { field: 'Assignee', _operator: 'is', value: 'Ritesh' },
//       ],
//     },
//     {
//       name: 'Filter Group 2',
//       canCancel: true,
//       isEditable: true,
//       filterListAndOr: false,
//       filters: [{ field: 'Department', _operator: 'is', value: 'HouseKeeping' }],
//     },
//   ],
// };

function getFilterGroupGridRowSpanStyle(filterGroups: UIFilterGroups, filterGroupIndex: number) {
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
  return <div>Advanced Filter</div>;

  // return (
  //   <div>
  //     <Card>
  //       <CardContent>
  //         <div className='grid grid-cols-9 gap-1'>
  //           {filterGroups.filterGroups.map((filterGroup, filterGroupIndex) => (
  //             <Fragment key={filterGroup.name}>
  //               <div className='col-start-1' style={{ ...getFilterGroupGridRowSpanStyle(filterGroups, filterGroupIndex) }}>
  //                 <p>{filterGroup.name}</p>
  //               </div>
  //               {filterGroup.filters.map((filter, FilterIndex) => (
  //                 <Fragment key={FilterIndex}>
  //                   <div className='col-start-2' style={{ ...getFilterGroupGridRowSpanStyle(filterGroups, filterGroupIndex) }}>
  //                     {filterGroup.filterListAndOr && FilterIndex == 0 && (
  //                       <>
  //                         <p>And/Or</p>
  //                         <Button>{filterGroup.filterListAndOr}</Button>
  //                       </>
  //                     )}
  //                   </div>
  //                   <div className='col-start-3'>
  //                     {FilterIndex == 0 && <p>Field</p>}
  //                     <Button>{filter.field}</Button>
  //                   </div>
  //                   <div>
  //                     {FilterIndex == 0 && <p>Operator</p>}
  //                     <Button>{filter.operator}</Button>
  //                   </div>
  //                   <div>
  //                     {FilterIndex == 0 && <p>Value</p>}
  //                     <Button>{'value' in filter ? filter.value : ''}</Button>
  //                   </div>
  //                   <div>
  //                     {FilterIndex == 0 && <p>And/Or</p>}
  //                     <Button disabled={filter.andOr === false}>{filter.andOr}</Button>
  //                   </div>
  //                   <Button>+</Button>
  //                   <Button>-</Button>
  //                 </Fragment>
  //               ))}
  //               <div className='col-start-9' style={{ ...getFilterGroupGridRowSpanStyle(filterGroups, filterGroupIndex) }}>
  //                 <Button>x</Button>
  //               </div>
  //               {filterGroupIndex !== filterGroups.length - 1 && (
  //                 <div className='col-span-full'>
  //                   <hr />
  //                 </div>
  //               )}
  //             </Fragment>
  //           ))}
  //         </div>
  //       </CardContent>
  //     </Card>
  //   </div>
  // );
}
