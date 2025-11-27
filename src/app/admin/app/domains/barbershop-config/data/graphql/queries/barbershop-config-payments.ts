import { gql } from 'apollo-angular';

export const BARBERSHOP_CONFIG_PAYMENTS = gql`
  query BarbershopPayments($documentId: ID!) {
    barbershop(documentId: $documentId) {
      paymentMethods {
        value
        id
      }
    }
  }
`;
