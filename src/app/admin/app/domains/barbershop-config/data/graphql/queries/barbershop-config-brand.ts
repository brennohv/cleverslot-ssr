import { gql } from 'apollo-angular';

export const BARBERSHOP_CONFIG_BRAND = gql`
  query BarbershopBrand($documentId: ID!) {
    barbershop(documentId: $documentId) {
      slug
      name
      logo {
        url
      }
      images {
        url
        id
      }
    }
  }
`;
