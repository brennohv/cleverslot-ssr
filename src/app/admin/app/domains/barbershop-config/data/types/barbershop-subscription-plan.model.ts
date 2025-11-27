export type IGetBarbershopSubscriptionPlan = {
  barbershop: {
    subscriptionPlan: null | BarbershopPlan;
  };
};

export type BarbershopPlan = 'BASIC' | 'ENTERPRISE';
