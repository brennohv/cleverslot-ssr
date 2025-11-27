import { gql } from 'apollo-angular';

export const BARBERSHOP_SUBSCRIPTION_PLAN = gql`
  query BarbershopSubscription($barbershopId: ID!) {
    barbershop(documentId: $barbershopId) {
      subscriptionPlan
    }
  }
`;
