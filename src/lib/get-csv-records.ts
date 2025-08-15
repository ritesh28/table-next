import { SerializableTask, Task, TaskSchema } from '@/model/task';
import { parse } from 'csv-parse';
import { createReadStream } from 'node:fs';
import path from 'node:path';

export async function getCsvRecords() {
  const serializableTasks: SerializableTask[] = [];
  const parser = createReadStream(path.resolve(process.cwd(), 'src', 'model', 'task-list.csv')).pipe(
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

export function transformSerializableTasks(serializableTasks: SerializableTask[]): Task[] {
  const tasks = serializableTasks.map((st) => TaskSchema.parse(st));
  return tasks;
}
