import { gql } from 'apollo-angular';

export const ENABLE_DISABLE_SERVICE = gql`
  mutation DisableEnableService($documentId: ID!, $data: ServiceInput!) {
    updateService(documentId: $documentId, data: $data) {
      documentId
    }
  }
`;
