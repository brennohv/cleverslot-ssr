import { gql } from 'apollo-angular';

export const CREATE_SCHEDULE_BLOCKER = gql`
  mutation createScheduleBlocker($data: ScheduleBlockerInput!) {
    createScheduleBlocker(data: $data) {
      documentId
    }
  }
`;
