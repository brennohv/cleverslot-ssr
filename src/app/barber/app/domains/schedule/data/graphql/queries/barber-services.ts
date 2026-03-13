import { gql } from 'apollo-angular';

export const BARBER_SERVICES = gql`
  query getBarberServices($barbershopId: ID!, $barberId: ID!) {
    services(
      pagination: { pageSize: 50 }
      filters: {
        barbershop: { documentId: { eq: $barbershopId } }
        barbers: { documentId: { eq: $barberId } }
        isActive: { eq: true }
      }
    ) {
      documentId
      photo {
        url
      }
      name
      recurrency
      value
      duration
    }
  }
`;
