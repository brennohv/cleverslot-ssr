import { gql } from 'apollo-angular';

export const DELETE_BARBER = gql`
  mutation DeleteBarber($documentId: ID!) {
    deleteBarber(documentId: $documentId) {
      documentId
    }
  }
`;
