import { gql } from 'apollo-angular';

export const GET_ALL_PROFESSIONALS = gql`
  query getAllProfessionals($barbershopId: ID!) {
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
