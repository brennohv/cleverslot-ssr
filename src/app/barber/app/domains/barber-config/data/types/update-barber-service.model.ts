import { IServiceId } from './barber-appointment.model';

export interface IUpdatebarberServiceResponse {
  updateBarber: IUpdatebarberServiceDTO;
}

export interface IUpdatebarberServiceDTO {
  services: IServiceId[];
}

export interface IServiceVariable {
  services: string[];
}

export interface IUpdatebarberServicVariables {
  barberId: string;
  data?: IServiceVariable;
}
