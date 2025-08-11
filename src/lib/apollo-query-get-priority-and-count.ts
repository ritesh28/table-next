import { graphql } from '@/model/gql-client';

export const GET_PRIORITIES_QUERY = graphql(/* GraphQL */ `
  query GetPriorities {
    priorities {
      name
      count
    }
  }
`);
