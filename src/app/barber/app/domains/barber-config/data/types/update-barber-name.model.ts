export interface IUpdatebarberNameResponse {
  updateBarber: IUpdatebarberNameDTO;
}

export interface IUpdatebarberNameDTO {
  firstName: string;
  lastName: string;
}

export interface IUpdatebarberVariable {
  firstName?: string;
  lastName?: string;
}

export interface IUpdatebarberNameVariables {
  barberId: string;
  data?: IUpdatebarberVariable;
}
