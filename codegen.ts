import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'src/model/schema.graphql',
  documents: ['src/lib/*.ts'],
  generates: {
    'src/model/gql-server-resolvers-types.ts': {
      config: {
        useIndexSignature: true,
      },
      plugins: ['typescript', 'typescript-resolvers'],
    },
    'src/model/gql-client/': {
      preset: 'client',
    },
  },
};
export default config;
