import { Task } from '@/model/task';
import { parse } from 'csv-parse';
import { createReadStream } from 'node:fs';

export type SerializableTask = Omit<Task, 'created_at'> & { created_at: string };

export async function getCsvRecords() {
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

  // todo: when session is implemented, update this function

  return serializableTasks;
}
