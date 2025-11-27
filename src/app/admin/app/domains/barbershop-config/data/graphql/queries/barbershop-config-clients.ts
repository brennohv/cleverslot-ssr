import { gql } from 'apollo-angular';
import { PaginatorFragment } from 'ba-ngrx-signal-based';

export const BARBERSHOP_CLIENTS = gql`
  query Clients_connection(
    $barbershopId: ID!
    $pagination: PaginationArg
    $identifier: String
  ) {
    usersPermissionsUsers_connection(
      pagination: $pagination
      filters: {
        barbershops: { documentId: { eq: $barbershopId } }
        or: [
          { email: { containsi: $identifier } }
          { username: { containsi: $identifier } }
        ]
      }
    ) {
      pageInfo {
        ...PaginatorFragment
      }
      nodes {
        documentId
        username
        email
        photo {
          url
        }
        telephone {
          internationalNumber
        }
      }
    }
  }
  ${PaginatorFragment}
`;
