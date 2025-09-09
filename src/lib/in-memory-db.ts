import { createRxDatabase } from 'rxdb';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';

const db = await createRxDatabase({
  name: 'inMemoryDB',
  storage: getRxStorageMemory(),
});
