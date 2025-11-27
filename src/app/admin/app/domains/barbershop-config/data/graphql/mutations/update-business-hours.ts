import { gql } from 'apollo-angular';

export const UPDATE_BUSINESS_HOURS = gql`
  mutation UpdateBarbershopBusinessHours(
    $documentId: ID!
    $data: BarbershopInput!
  ) {
    updateBarbershop(documentId: $documentId, data: $data) {
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
