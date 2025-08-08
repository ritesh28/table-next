import { columns } from '@/components/task/columns';
import { DataTable } from '@/components/task/table';
import { Task } from '@/model/task';
import { parse } from 'csv-parse';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { createReadStream } from 'node:fs';

export const getStaticProps = (async () => {
  const tasks: Task[] = [];
  const parser = createReadStream('src/model/task-list.csv').pipe(
    parse({
      columns: true,
      skipEmptyLines: true,
    }),
  );

  for await (const record of parser) {
    tasks.push(record);
  }

  return {
    props: {
      tasks,
    },
  };
}) satisfies GetStaticProps<{
  tasks: Task[];
}>;

export default function HomePage({ tasks }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} data={tasks} />
    </div>
  );
}
