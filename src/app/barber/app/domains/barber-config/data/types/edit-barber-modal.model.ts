export interface IEditProfessionalModalData {
  title: string;
  contentView: IEditProfessionalView;
}

export enum IEditProfessionalView {
  FIRST_NAME = 'FIRST_NAME',
  LAST_NAME = 'LAST_NAME',
}
