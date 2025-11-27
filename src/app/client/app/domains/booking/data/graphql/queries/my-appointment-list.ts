import { gql } from 'apollo-angular';
import { PaginatorFragment } from 'ba-ngrx-signal-based';

export const MY_APPOINTMENT_LIST = gql`
  query myAppointments(
    $userId: ID!
    $startDate: Date
    $endDate: Date
    $pagination: PaginationArg
    $sort: [String]
  ) {
    appointments_connection(
      pagination: $pagination
      sort: $sort
      filters: {
        client: { documentId: { eq: $userId } }
        and: [{ date: { gte: $startDate } }, { date: { lte: $endDate } }]
      }
    ) {
      nodes {
        documentId
        date
        startTime
        endTime
        appointmentStatus
        barbershop {
          name
          logo {
            url
          }
          slug
        }
        service {
          documentId
          name
          value
          recurrency
        }
      }
      pageInfo {
        ...PaginatorFragment
      }
    }
  }
  ${PaginatorFragment}
`;
