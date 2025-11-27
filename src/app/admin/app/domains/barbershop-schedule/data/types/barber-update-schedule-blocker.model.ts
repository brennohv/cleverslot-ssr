import { ICreateScheduleBlockerParams } from './barber-create-schedule-blocker.model';

export interface IUpdateScheduleBlockerResponse {
  updateScheduleBlocker: {
    id: string;
  };
}

export interface IUpdateScheduleBlockerParams
  extends ICreateScheduleBlockerParams {
  blockerId: string;
}

export interface IUpdateScheduleBlockerVariables {
  data: ICreateScheduleBlockerParams;
  blockerId: string;
}
