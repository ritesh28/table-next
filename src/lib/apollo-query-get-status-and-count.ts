import { graphql } from '@/model/gql-client';

export const GET_STATUSES_QUERY = graphql(/* GraphQL */ `
  query GetStatuses {
    statuses {
      name
      count
    }
  }
`);
