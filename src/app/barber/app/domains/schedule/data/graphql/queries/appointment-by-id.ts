import { gql } from 'apollo-angular';

export const APPOINTMENT_BY_ID = gql`
  query AppointmentById($appointmentId: ID!) {
    appointment(documentId: $appointmentId) {
      documentId
      date
      client {
        documentId
        username
        email
        telephone {
          internationalNumber
        }
        photo {
          url
        }
      }
      startTime
      endTime
      appointmentStatus
      nonRegisteredUser {
        name
        telephone {
          internationalNumber
        }
      }
      service {
        documentId
        name
        value
        recurrency
      }
    }
  }
`;
