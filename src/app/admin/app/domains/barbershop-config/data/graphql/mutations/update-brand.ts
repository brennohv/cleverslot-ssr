import { gql } from 'apollo-angular';

export const UPDATE_BRAND = gql`
  mutation UpdateBarbershopBrand($documentId: ID!, $data: BarbershopInput!) {
    updateBarbershop(documentId: $documentId, data: $data) {
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
