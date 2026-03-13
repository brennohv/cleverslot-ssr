import { gql } from 'apollo-angular';

export const BARBER_APPOINTMENTS = gql`
  query getMyAppointments($date: Date, $barberId: ID) {
    appointments(
      pagination: { pageSize: 150 }
      filters: {
        barber: { documentId: { eq: $barberId } }
        date: { eq: $date }
      }
    ) {
      documentId
      date
      startTime
      endTime
      appointmentStatus
      nonRegisteredUser {
        name
        telephone {
          internationalNumber
        }
      }
      client {
        username
        telephone {
          internationalNumber
        }
        photo {
          url
        }
      }
      service {
        name
      }
    }
  }
`;
