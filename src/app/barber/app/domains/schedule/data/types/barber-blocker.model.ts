export interface IBarberBlockersResponse {
  scheduleBlockers: IBarberBlockers[];
}

export interface IBarberBlockers {
  documentId: string;
  endDate: string;
  endTime: string;
  startDate: string;
  startTime: string;
}

export interface IBarberBlockersVariables {
  barber: string;
  date: string;
  dayOfWeek: string;
}
