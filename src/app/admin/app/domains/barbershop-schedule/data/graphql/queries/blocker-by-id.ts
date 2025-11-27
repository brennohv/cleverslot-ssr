import { gql } from 'apollo-angular';

export const BLOCKER_BY_ID = gql`
  query getBlockerById($blockerId: ID!) {
    scheduleBlocker(documentId: $blockerId) {
      endDate
      endTime
      startDate
      startTime
      daysOfWeek {
        dayOfWeek
      }
    }
  }
`;
