import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import {
  CustomRxjsService,
  IFreeSlotsResponse,
  GeneralAppointmentsService,
  ICreateAppointmentResponse,
  IUpdateAppointmentResponse,
  IUpdateAppointmentParams,
  ICreateAppointmentParams,
  IFreeSlotsParams,
  ICancelAppointmentResponse,
} from 'ba-ngrx-signal-based';
import {
  IBarberAppointmentsResponse,
  IBarberAppointmenVariables,
  IBusinessHour,
  IBusinessHourResponse,
  IBusinessHourVariables,
  IBarberBlockersResponse,
  IBarberBlockersVariables,
  IBarberServiceListResponse,
  IBarberServiceListVariables,
  IBarbershopClientsResponse,
  IClientsFromBarbershopResponse,
  IClientsFromBarbershopVariables,
  ICreateScheduleBlockerParams,
  ICreateScheduleBlockerResponse,
  ICreateScheduleBlockerVariables,
  IBarberBlockerIdResponse,
  IBarberBlockerIdVariables,
  IUpdateScheduleBlockerParams,
  IUpdateScheduleBlockerResponse,
  IUpdateScheduleBlockerVariables,
  IBarberAppoitmentIdResponse,
  IBarberAppoitmentIdVariables,
  IDeleteScheduleBlockerParams,
  IDeleteScheduleBlockerResponse,
} from '@admin/barbershop-schedule/data/types';
import {
  BARBER_APPOINTMENTS,
  BUSINESS_HOURS,
  BARBER_SCHEDULE_BLOCKERS,
  BARBER_SERVICES,
  CLIENTS_FROM_BARBERSHOP,
  CREATE_SCHEDULE_BLOCKER,
  BLOCKER_BY_ID,
  UPDATE_SCHEDULE_BLOCKER,
  APPOINTMENT_BY_ID,
  DELETE_SCHEDULE_BLOCKER,
} from '@admin/barbershop-schedule/data/graphql';

import dayjs from 'dayjs';
import { GET_ALL_PROFESSIONALS } from '@admin/shared/data/graphql';
import {
  IProfessionalListResponse,
  IProfessionalListVariables,
} from '@admin/shared/data/types';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private readonly customRxjs = inject(CustomRxjsService);
  private readonly apollo = inject(Apollo);
  #generalAppointment = inject(GeneralAppointmentsService);

  constructor() {}

  getBarberAppointments(
    date: string,
    barberId: string
  ): Observable<Apollo.QueryResult<IBarberAppointmentsResponse>> {
    return this.apollo
      .query<IBarberAppointmentsResponse, IBarberAppointmenVariables>({
        query: BARBER_APPOINTMENTS,
        fetchPolicy: 'network-only',
        variables: {
          barberId: barberId,
          date: date,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }

  getBarberBlockers(
    date: string,
    barberId: string
  ): Observable<Apollo.QueryResult<IBarberBlockersResponse>> {
    return this.apollo
      .query<IBarberBlockersResponse, IBarberBlockersVariables>({
        query: BARBER_SCHEDULE_BLOCKERS,
        fetchPolicy: 'network-only',
        variables: {
          barber: barberId,
          date: date,
          dayOfWeek: dayjs(date).format('dddd').toUpperCase(),
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }

  getBlockerById(
    blockerId: string
  ): Observable<Apollo.QueryResult<IBarberBlockerIdResponse>> {
    return this.apollo
      .query<IBarberBlockerIdResponse, IBarberBlockerIdVariables>({
        query: BLOCKER_BY_ID,
        fetchPolicy: 'network-only',
        variables: {
          blockerId: blockerId,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }

  getAppointmentById(
    appointmentId: string
  ): Observable<Apollo.QueryResult<IBarberAppoitmentIdResponse>> {
    return this.apollo
      .query<IBarberAppoitmentIdResponse, IBarberAppoitmentIdVariables>({
        query: APPOINTMENT_BY_ID,
        fetchPolicy: 'network-only',
        variables: {
          appointmentId: appointmentId,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }

  updateAppointment(
    params: IUpdateAppointmentParams
  ): Observable<Apollo.MutateResult<IUpdateAppointmentResponse>> {
    return this.#generalAppointment.editAppointment(params);
  }

  cancelAppointment(
    appointmentId: string
  ): Observable<Apollo.MutateResult<ICancelAppointmentResponse>> {
    return this.#generalAppointment.cancelAppointment(appointmentId);
  }

  getBusinessHour(
    slug: string
  ): Observable<Apollo.QueryResult<IBusinessHour[]>> {
    return this.apollo
      .query<IBusinessHourResponse, IBusinessHourVariables>({
        query: BUSINESS_HOURS,
        fetchPolicy: 'network-only',
        variables: {
          slug: slug,
        },
      })
      .pipe(
        this.customRxjs.catchAndReturnError(),
        map((res) => {
          return {
            ...res,
            data: res.data?.barbershops,
          };
        }),
        map((resp) => {
          return {
            ...resp,
            data: resp?.data?.[0]?.establishment || [],
          };
        })
      );
  }

  getFreeSlots(
    params: IFreeSlotsParams
  ): Observable<Apollo.QueryResult<IFreeSlotsResponse>> {
    return this.#generalAppointment.getFreeSlots(params);
  }

  getServiceList(
    barberId: string,
    barbershopId: string
  ): Observable<Apollo.QueryResult<IBarberServiceListResponse>> {
    return this.apollo
      .query<IBarberServiceListResponse, IBarberServiceListVariables>({
        query: BARBER_SERVICES,
        fetchPolicy: 'network-only',
        variables: {
          barberId,
          barbershopId,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }

  getClientList(
    barbershopId: string,
    identifier?: string
  ): Observable<Apollo.QueryResult<IClientsFromBarbershopResponse>> {
    return this.apollo
      .query<IBarbershopClientsResponse, IClientsFromBarbershopVariables>({
        query: CLIENTS_FROM_BARBERSHOP,
        fetchPolicy: 'network-only',
        variables: {
          barbershopId,
          ...(identifier && { identifier }),
        },
      })
      .pipe(
        this.customRxjs.catchAndReturnError(),
        map((res) => {
          return {
            ...res,
            data: res.data?.barbershop,
          };
        })
      );
  }

  bookAppointment(
    params: ICreateAppointmentParams
  ): Observable<Apollo.MutateResult<ICreateAppointmentResponse>> {
    return this.#generalAppointment.bookAppointment(params);
  }

  createScheduleBlocker(
    params: ICreateScheduleBlockerParams
  ): Observable<Apollo.MutateResult<ICreateScheduleBlockerResponse>> {
    return this.apollo
      .mutate<ICreateScheduleBlockerResponse, ICreateScheduleBlockerVariables>({
        mutation: CREATE_SCHEDULE_BLOCKER,
        variables: {
          data: params,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }

  editScheduleBlocker(
    params: IUpdateScheduleBlockerParams
  ): Observable<Apollo.MutateResult<IUpdateScheduleBlockerResponse>> {
    return this.apollo
      .mutate<IUpdateScheduleBlockerResponse, IUpdateScheduleBlockerVariables>({
        mutation: UPDATE_SCHEDULE_BLOCKER,
        variables: {
          data: {
            barber: params.barber,
            daysOfWeek: params.daysOfWeek,
            endDate: params.endDate,
            endTime: params.endTime,
            startDate: params.startDate,
            startTime: params.startTime,
          },
          blockerId: params.blockerId,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }

  deleteScheduleBlocker(
    params: IDeleteScheduleBlockerParams
  ): Observable<Apollo.MutateResult<IDeleteScheduleBlockerResponse>> {
    return this.apollo
      .mutate<IDeleteScheduleBlockerResponse, IDeleteScheduleBlockerParams>({
        mutation: DELETE_SCHEDULE_BLOCKER,
        variables: {
          blockerId: params.blockerId,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }

  getAllProfessionals(
    barbershopId: string
  ): Observable<Apollo.QueryResult<IProfessionalListResponse>> {
    return this.apollo
      .query<IProfessionalListResponse, IProfessionalListVariables>({
        query: GET_ALL_PROFESSIONALS,
        fetchPolicy: 'network-only',
        variables: {
          barbershopId: barbershopId,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }
}
