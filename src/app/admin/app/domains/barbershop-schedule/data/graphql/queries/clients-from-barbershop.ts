import { gql } from 'apollo-angular';

export const CLIENTS_FROM_BARBERSHOP = gql`
  query clientsFromBarbershop($barbershopId: ID!, $identifier: String) {
    barbershop(documentId: $barbershopId) {
      clients(
        pagination: { pageSize: 50 }
        filters: {
          or: [
            { email: { containsi: $identifier } }
            { username: { containsi: $identifier } }
          ]
        }
      ) {
        documentId
        username
        email
        photo {
          url
        }
      }
    }
  }
`;
