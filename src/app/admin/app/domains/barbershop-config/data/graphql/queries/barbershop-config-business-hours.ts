import { gql } from 'apollo-angular';

export const BARBERSHOP_CONFIG_BUSINESS_HOURS = gql`
  query BarbershopBusinessHours($documentId: ID!) {
    barbershop(documentId: $documentId) {
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
