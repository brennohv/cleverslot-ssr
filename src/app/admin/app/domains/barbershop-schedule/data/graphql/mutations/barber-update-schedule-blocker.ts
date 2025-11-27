import { gql } from 'apollo-angular';

export const UPDATE_SCHEDULE_BLOCKER = gql`
  mutation updateScheduleBlocker(
    $blockerId: ID!
    $data: ScheduleBlockerInput!
  ) {
    updateScheduleBlocker(documentId: $blockerId, data: $data) {
      documentId
    }
  }
`;
