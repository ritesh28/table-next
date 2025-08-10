import { columns } from '@/components/task/columns';
import { DataTable } from '@/components/task/table';
import { Task } from '@/model/task';
import { parse } from 'csv-parse';
import moment from 'moment';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { createReadStream } from 'node:fs';

type SerializableTask = Omit<Task, 'created_at'> & { created_at: string };

export const getStaticProps = (async () => {
  const serializableTasks: SerializableTask[] = [];
  const parser = createReadStream('src/model/task-list.csv').pipe(
    parse({
      columns: true,
      skipEmptyLines: true,
    }),
  );

  for await (const record of parser) {
    serializableTasks.push(record);
  }

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
