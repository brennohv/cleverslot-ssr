import { gql } from 'apollo-angular';

export const UPDATE_BARBER_CONFIG_SERVICES = gql`
  mutation UpdateBarber($barberId: ID!, $data: BarberInput!) {
    updateBarber(documentId: $barberId, data: $data) {
      services {
        documentId
      }
    }
  }
`;
