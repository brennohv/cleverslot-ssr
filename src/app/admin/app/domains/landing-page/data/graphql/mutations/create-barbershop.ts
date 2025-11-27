import { gql } from 'apollo-angular';

export const MUTATION_CREATE_BARBERSHOP = gql`
  mutation CreateBarbershop($data: BarbershopInput!) {
    createBarbershop(data: $data) {
      documentId
      slug
      name
      admins {
        documentId
      }
    }
  }
`;
