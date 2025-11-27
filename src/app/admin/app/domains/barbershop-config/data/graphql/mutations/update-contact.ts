import { gql } from 'apollo-angular';

export const UPDATE_CONTACT = gql`
  mutation UpdateBarbershopAddress($documentId: ID!, $data: BarbershopInput!) {
    updateBarbershop(documentId: $documentId, data: $data) {
      telephone {
        internationalNumber
        countryCode
        number
        id
      }
    }
  }
`;
