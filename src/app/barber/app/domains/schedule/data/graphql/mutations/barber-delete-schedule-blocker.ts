import { gql } from 'apollo-angular';

export const DELETE_SCHEDULE_BLOCKER = gql`
  mutation deleteScheduleBlocker($blockerId: ID!) {
    deleteScheduleBlocker(documentId: $blockerId) {
      documentId
    }
  }
`;
