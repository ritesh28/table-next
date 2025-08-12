import { graphql } from '@/model/gql-client';

export const GET_ESTIMATED_HOUR_MIN_MAX = graphql(/* GraphQL */ `
  query GetEstimatedHourMinMax {
    estimatedHour {
      min
      max
    }
  }
`);
