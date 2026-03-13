import { gql } from 'apollo-angular';

export const BARBER_PROFILE = gql`
  query getBarberById($barberId: ID!) {
    barber(documentId: $barberId) {
      documentId
      firstName
      lastName
      services {
        documentId
      }
    }
  }
`;
