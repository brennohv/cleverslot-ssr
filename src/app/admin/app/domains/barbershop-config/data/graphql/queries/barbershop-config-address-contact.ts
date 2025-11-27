import { gql } from 'apollo-angular';

export const BARBERSHOP_CONFIG_ADDRESS_CONTACT = gql`
  query BarbershopPayments($documentId: ID!) {
    barbershop(documentId: $documentId) {
      address {
        country
        city
        postalCode
        street
        number
        complement
        id
      }
      telephone {
        internationalNumber
        countryCode
        number
        id
      }
    }
  }
`;
