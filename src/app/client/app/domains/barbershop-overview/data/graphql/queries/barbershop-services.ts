import { gql } from 'apollo-angular';
import { PaginatorFragment } from 'ba-ngrx-signal-based';

export const BARBERSHOP_SERVICES = gql`
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
        isActive: { eq: true }
      }
    ) {
      nodes {
        duration
        documentId
        professionalPercentage
        name
        photo {
          url
        }
        recurrency
        value
      }
      pageInfo {
        ...PaginatorFragment
      }
    }
  }
  ${PaginatorFragment}
`;
