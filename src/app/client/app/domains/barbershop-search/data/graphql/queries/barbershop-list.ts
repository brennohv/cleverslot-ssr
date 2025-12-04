import { gql } from 'apollo-angular';
import { PaginatorFragment } from 'ba-ngrx-signal-based';

export const BARBERSHOP_LIST = gql`
  query getBarbershop($name: String, $pagination: PaginationArg) {
    barbershops_connection(
      pagination: $pagination
      filters: { name: { containsi: $name }, isActive: { eq: true } }
    ) {
      nodes {
        name
        slug
        telephone {
          internationalNumber
        }
        address {
          street
          number
          city
          postalCode
        }
        logo {
          url
        }
      }
      pageInfo {
        ...PaginatorFragment
      }
    }
  }
  ${PaginatorFragment}
`;
