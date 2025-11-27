import { gql } from 'apollo-angular';

export const CREATE_SERVICE = gql`
  mutation CreateService($data: ServiceInput!) {
    createService(data: $data) {
      duration
      documentId
      professionalPercentage
      name
      isActive
      photo {
        url
      }
      recurrency
      value
      barbers {
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
  }
`;
