export type IEnableDisableServiceResponse = {
  updateService: IEnableDisableService;
};

export interface IEnableDisableService {
  documentId: string;
}

export interface IEnableDisableServiceVariables {
  documentId: string;
  data: {
    isActive: boolean;
  };
}
