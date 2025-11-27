import { gql } from 'apollo-angular';

export const PROFESSIONAL_LIST_BY_SERVICE = gql`
  query allProfessionalsFromService($barbershopId: ID!, $serviceId: ID!) {
    barbers(
      filters: {
        and: {
          barbershop: { documentId: { eq: $barbershopId } }
          services: { documentId: { eq: $serviceId } }
        }
      }
    ) {
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
`;
