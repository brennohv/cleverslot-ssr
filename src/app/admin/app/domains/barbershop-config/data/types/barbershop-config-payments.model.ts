export type IUpdatePaymentListResponse = {
  updateBarbershop: {
    paymentMethods: IBarbershopPaymentDTO[];
  };
};

export type IGetPaymentListResponse = {
  barbershop: {
    paymentMethods: IBarbershopPaymentDTO[];
  };
};

export interface IBarbershopPaymentDTO {
  value: string;
  id?: string;
}

export interface IUpdatePaymentsVariables {
  documentId: string;
  data: {
    paymentMethods: IBarbershopPaymentDTO[];
  };
}
export interface IGetPaymentsVariables {
  documentId: string;
}
