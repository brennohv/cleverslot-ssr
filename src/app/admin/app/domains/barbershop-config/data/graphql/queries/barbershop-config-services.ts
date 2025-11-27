import { gql } from 'apollo-angular';
import { PaginatorFragment } from 'ba-ngrx-signal-based';

export const BARBERSHOP_CONFIG_SERVICES = gql`
  query services_connection(
    $barbershopId: ID!
    $pagination: PaginationArg
    $serviceName: String
  ) {
    services_connection(
      pagination: $pagination
      sort: "name"
      filters: {
        barbershop: { documentId: { eq: $barbershopId } }
        name: { containsi: $serviceName }
      }
    ) {
      nodes {
        duration
        documentId
        professionalPercentage
        name
        isActive
        photo {
          url
        }
        recurrency
        value
        barbers {
          documentId
          firstName
          lastName
          userBarber {
            photo {
              url
            }
          }
        }
      }
      pageInfo {
        ...PaginatorFragment
      }
    }
  }
  ${PaginatorFragment}
`;
