import { graphql } from '@/model/gql-client';

export const GET_LABELS_QUERY = graphql(/* GraphQL */ `
  query GetLabels {
    labels {
      name
      count
    }
  }
`);
