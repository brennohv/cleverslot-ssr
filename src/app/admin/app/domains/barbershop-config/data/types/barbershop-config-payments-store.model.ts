import { IBarbershopPaymentDTO } from './barbershop-config-payments.model';

export type IBarbershopConfigPaymentsStore = {
  paymentMethods: IBarbershopPaymentDTO[];
};
