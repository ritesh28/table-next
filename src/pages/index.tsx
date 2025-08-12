import { columns } from '@/components/task-table/columns';
import { DataTable } from '@/components/task-table/table';
import { getCsvRecords, type SerializableTask } from '@/lib/get-csv-records';
import moment from 'moment';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';

export const getStaticProps = (async () => {
  const serializableTasks = await getCsvRecords();
  return {
    props: {
      serializableTasks,
    },
  };
}) satisfies GetStaticProps<{
  serializableTasks: SerializableTask[];
}>;

export default function HomePage({ serializableTasks }: InferGetStaticPropsType<typeof getStaticProps>) {
  const tasks = serializableTasks.map((st) => ({
    ...st,
    created_at: moment(st.created_at, 'DD/MM/YYYY'),
  }));
  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} data={tasks} />
    </div>
  );
}
