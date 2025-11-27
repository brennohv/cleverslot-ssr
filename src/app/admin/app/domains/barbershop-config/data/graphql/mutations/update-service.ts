import { gql } from 'apollo-angular';

export const UPDATE_SERVICE = gql`
  mutation UpdateService($documentId: ID!, $data: ServiceInput!) {
    updateService(documentId: $documentId, data: $data) {
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
