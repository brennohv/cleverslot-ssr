import { gql } from 'apollo-angular';

export const UPDATE_ADDRESS = gql`
  mutation UpdateBarbershopAddress($documentId: ID!, $data: BarbershopInput!) {
    updateBarbershop(documentId: $documentId, data: $data) {
      address {
        country
        city
        postalCode
        street
        number
        complement
        id
      }
    }
  }
`;
