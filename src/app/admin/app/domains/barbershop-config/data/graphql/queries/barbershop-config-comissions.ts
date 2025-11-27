import { gql } from 'apollo-angular';

export const BARBERSHOP_BARBER_COMISSIONS = gql`
  query ComissionsByProfessional($data: BarberComissionsInput!) {
    comissionsByProfessional(data: $data) {
      salary
      services {
        name
        quantity
        totalValue
        photoUrl
        recurrency
        appointments {
          startTime
          date
          client {
            username
          }
          nonRegisteredUser {
            name
          }
        }
      }
    }
  }
`;

export const PROFESSIONAL_LIST = gql`
  query allProfessionals($barbershopId: ID!) {
    barbers(filters: { barbershop: { documentId: { eq: $barbershopId } } }) {
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
