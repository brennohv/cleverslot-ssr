import { gql } from 'apollo-angular';

export const BARBER_COMISSIONS = gql`
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
