import { gql } from 'apollo-angular';

export const BARBERSHOP_BY_SLUG = gql`
  query getBarbershop($slug: String!) {
    barbershops(filters: { slug: { eq: $slug } }) {
      documentId
      name
      slug
      images {
        url
      }
      paymentMethods {
        id
        value
      }
      establishment {
        day
        firstPeriodStart
        firstPeriodEnd
        secondPeriodStart
        secondPeriodEnd
      }
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
  }
`;
