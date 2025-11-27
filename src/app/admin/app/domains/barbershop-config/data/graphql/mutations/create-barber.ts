import { gql } from 'apollo-angular';

export const CREATE_BARBER = gql`
  mutation CreateBarber($data: BarberInput!) {
    createBarber(data: $data) {
      documentId
      firstName
      lastName
      userBarber {
        email
        photo {
          url
        }
      }
    }
  }
`;
