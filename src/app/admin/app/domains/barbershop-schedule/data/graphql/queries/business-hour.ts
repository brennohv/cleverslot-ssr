import { gql } from 'apollo-angular';

export const BUSINESS_HOURS = gql`
  query getBusinessHours($slug: String!) {
    barbershops(filters: { slug: { eq: $slug } }) {
      documentId
      establishment {
        day
        firstPeriodStart
        firstPeriodEnd
        secondPeriodStart
        secondPeriodEnd
      }
    }
  }
`;
