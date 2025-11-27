import { gql } from 'apollo-angular';

export const UPDATE_PAYMENTS = gql`
  mutation UpdateBarbershopPayments($documentId: ID!, $data: BarbershopInput!) {
    updateBarbershop(documentId: $documentId, data: $data) {
      paymentMethods {
        value
        id
      }
    }
  }
`;
