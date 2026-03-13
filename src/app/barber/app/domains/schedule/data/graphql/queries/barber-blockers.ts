import { gql } from 'apollo-angular';

export const BARBER_SCHEDULE_BLOCKERS = gql`
  query scheduleBlockersFromBarber(
    $date: Date
    $barber: ID
    $dayOfWeek: String
  ) {
    scheduleBlockers(
      filters: {
        barber: { documentId: { eq: $barber } }
        startDate: { lte: $date }
        endDate: { gte: $date }
        daysOfWeek: { dayOfWeek: { eq: $dayOfWeek } }
      }
    ) {
      documentId
      endDate
      endTime
      startDate
      startTime
    }
  }
`;
