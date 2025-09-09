const mySchema = {
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
    },
    name: {
      type: 'string',
    },
    birthdate: {
      type: 'string',
      format: 'date',
    },
    secret: {
      type: 'string',
    },
  },
  additionalProperties: false,
  required: ['name', 'birthdate', 'id'],
  // RxDB specific fields:
  //   primaryKey: 'id',
  version: 0,
  keyCompression: true,
  indexes: [
    'name', // single-field index
    ['name', 'birthdate'], // compound index
  ],
  encrypted: ['secret'],
};
