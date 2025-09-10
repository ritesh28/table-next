import { SerializableTask, Task, TaskSchema } from '@/model/task';
import csvData from '@/model/task-list.csv';

export async function getCsvRecords() {
  const serializableTasks: SerializableTask[] = [];

  for await (const record of csvData) {
    serializableTasks.push(record);
  }

  return serializableTasks;
}

export function transformSerializableTasks(serializableTasks: SerializableTask[]): Task[] {
  const tasks = serializableTasks.map((st) => TaskSchema.parse(st));
  return tasks;
}
