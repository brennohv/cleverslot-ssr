import { gql } from 'apollo-angular';
import { PaginatorFragment } from 'ba-ngrx-signal-based';

export const BARBERSHOP_CONFIG_BARBER = gql`
  query Barbers_connection($pagination: PaginationArg, $barbershopId: ID!) {
    barbers_connection(
      filters: { barbershop: { documentId: { eq: $barbershopId } } }
      pagination: $pagination
    ) {
      pageInfo {
        ...PaginatorFragment
      }
      nodes {
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
  }
  ${PaginatorFragment}
`;
