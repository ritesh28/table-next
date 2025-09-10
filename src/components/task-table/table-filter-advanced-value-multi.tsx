import { Combobox, ComboboxItem } from '@/components/combobox';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCombobox } from '@/hooks/useCombobox';
import { GET_LABELS_QUERY } from '@/lib/apollo-query-get-label-and-count';
import { GET_PRIORITIES_QUERY } from '@/lib/apollo-query-get-priority-and-count';
import { GET_STATUSES_QUERY } from '@/lib/apollo-query-get-status-and-count';
import { LABEL_ICONS, PRIORITY_ICONS, STATUS_ICONS, Task } from '@/model/task';
import { useQuery } from '@apollo/client';
import { ChevronsUpDown, LucideIcon } from 'lucide-react';
import { useEffect } from 'react';

interface DataTableFilterAdvancedValueMultiProps {
  columnId: keyof Task;
  values: string[] | null;
  onValuesChange: (value: string[] | null) => void;
  disabled?: boolean;
}

export function DataTableFilterAdvancedValueMulti({ columnId, values, onValuesChange, disabled }: DataTableFilterAdvancedValueMultiProps) {
  const IS_MULTI_SELECT = true;
  const { selectedItems, handleItemSelect } = useCombobox(values, IS_MULTI_SELECT);

  useEffect(() => {
    onValuesChange(selectedItems);
  }, [selectedItems]); // todo: adding onValuesChange breaks multi select. Fix it

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
      content: ContentWithIcon(Icon, id),
    };
  });
  const statusMultiSelect = statusData?.statuses.map(({ name: id, count: totalCount }) => {
    const Icon = STATUS_ICONS[id as Task['status']];
    return {
      id,
      totalCount,
      content: ContentWithIcon(Icon, id),
    };
  });
  const labelMultiSelect = labelData?.labels.map(({ name: id, count: totalCount }) => {
    const Icon = LABEL_ICONS[id as Task['label']];
    return {
      id,
      totalCount,
      content: ContentWithIcon(Icon, id),
    };
  });

  return (
    <Combobox
      items={(priorityMultiSelect || statusMultiSelect || labelMultiSelect) as ComboboxItem[]}
      selectedItems={values}
      handleItemSelect={(newVal) => handleItemSelect(newVal)}
      isMultiSelect
      buttonChildren={
        values ? (
          <div className='w-full flex items-center gap-1'>
            {values.map((item) => (
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
      buttonClassName='w-full overflow-clip'
      popoverContentClassName='w-[250px]'
      disabled={disabled}
    />
  );
}

function ContentWithIcon(Icon: LucideIcon, id: string) {
  return (
    <div className='flex items-center gap-1'>
      <Icon />
      <span>{id}</span>
    </div>
  );
}
