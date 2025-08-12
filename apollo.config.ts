// config for 'Apollo GraphQL' extension

export default {
  client: {
    service: {
      name: 'my-graphql-app',
      // can be a string pointing to a single file or an array of strings
      localSchemaFile: 'src/model/schema.graphql',
    },
  },
};
