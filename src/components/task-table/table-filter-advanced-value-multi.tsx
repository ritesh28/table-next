import { Combobox, ComboboxItem } from '@/components/combobox';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { GET_LABELS_QUERY } from '@/lib/apollo-query-get-label-and-count';
import { GET_PRIORITIES_QUERY } from '@/lib/apollo-query-get-priority-and-count';
import { GET_STATUSES_QUERY } from '@/lib/apollo-query-get-status-and-count';
import { LABEL_ICONS, PRIORITY_ICONS, STATUS_ICONS, Task } from '@/model/task';
import { useQuery } from '@apollo/client';
import { ChevronsUpDown } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface DataTableFilterAdvancedValueMultiProps {
  columnId: keyof Task;
  value: string[] | null;
  setValue: Dispatch<SetStateAction<string[] | null>>;
  disabled?: boolean;
}

export function DataTableFilterAdvancedValueMulti({ columnId, value, setValue, disabled }: DataTableFilterAdvancedValueMultiProps) {
  const {
    loading: priorityLoading,
    error: priorityError,
    data: priorityData,
  } = useQuery(GET_PRIORITIES_QUERY, {
    skip: columnId !== 'priority',
  });
  const {
    loading: statusLoading,
    error: statusError,
    data: statusData,
  } = useQuery(GET_STATUSES_QUERY, {
    skip: columnId !== 'status',
  });
  const {
    loading: labelLoading,
    error: labelError,
    data: labelData,
  } = useQuery(GET_LABELS_QUERY, {
    skip: columnId !== 'label',
  });

  if ((priorityLoading || priorityData === undefined) && (statusLoading || statusData === undefined) && (labelLoading || labelData === undefined)) {
    return <Skeleton className='h-full w-full rounded-sm' />;
  }
  if (priorityError || statusError || labelError) {
    // hide component
    return null;
  }

  const priorityMultiSelect = priorityData?.priorities.map(({ name: id, count: totalCount }) => {
    const Icon = PRIORITY_ICONS[id as Task['priority']];
    return {
      id,
      totalCount,
      content: (
        <div className='flex items-center gap-1'>
          <Icon />
          <span>{id}</span>
        </div>
      ),
    };
  });
  const statusMultiSelect = statusData?.statuses.map(({ name: id, count: totalCount }) => {
    const Icon = STATUS_ICONS[id as Task['status']];
    return {
      id,
      totalCount,
      content: (
        <div className='flex items-center gap-1'>
          <Icon />
          <span>{id}</span>
        </div>
      ),
    };
  });
  const labelMultiSelect = labelData?.labels.map(({ name: id, count: totalCount }) => {
    const Icon = LABEL_ICONS[id as Task['label']];
    return {
      id,
      totalCount,
      content: (
        <div className='flex items-center gap-1'>
          <Icon />
          <span>{id}</span>
        </div>
      ),
    };
  });

  return (
    <Combobox
      items={(priorityMultiSelect || statusMultiSelect || labelMultiSelect) as ComboboxItem[]}
      selectedItems={value}
      handleItemSelect={(newVal) => setValue([newVal])}
      isMultiSelect
      buttonChildren={
        value ? (
          <div className='w-full flex items-center gap-1'>
            {value.map((item) => (
              <Badge key={item}>{item}</Badge>
            ))}
          </div>
        ) : (
          <div className='w-full flex items-center justify-between gap-1'>
            <span>Select Options...</span>
            <ChevronsUpDown />
          </div>
        )
      }
      buttonClassName='w-full text-ellipsis'
      popoverContentClassName='w-[250px]'
      disabled={disabled}
    />
  );
}
