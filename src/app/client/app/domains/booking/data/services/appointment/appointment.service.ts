import { Injectable, inject } from '@angular/core';
import {
  CustomRxjsService,
  GeneralAppointmentsService,
  ICancelAppointmentResponse,
} from 'ba-ngrx-signal-based';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client/core';
import { Observable } from 'rxjs';
import {
  IAppointmentsParams,
  IAppointmentsResponse,
} from '@client/booking/data/types';
import { MY_APPOINTMENT_LIST } from '@client/booking/data/graphql';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  #customRxjs = inject(CustomRxjsService);
  #apollo = inject(Apollo);
  #generalAppointment = inject(GeneralAppointmentsService);

  appointmentsByUserId(
    params: IAppointmentsParams
  ): Observable<Apollo.QueryResult<IAppointmentsResponse>> {
    return this.#apollo
      .query<IAppointmentsResponse, IAppointmentsParams>({
        query: MY_APPOINTMENT_LIST,
        fetchPolicy: 'network-only',
        variables: {
          sort: params.sort,
          userId: params.userId,
          startDate: params.startDate,
          endDate: params.endDate,
          pagination: params.pagination,
        },
      })
      .pipe(this.#customRxjs.catchAndReturnError());
  }

  cancelAppointment(
    appointmentId: string
  ): Observable<Apollo.MutateResult<ICancelAppointmentResponse>> {
    return this.#generalAppointment.cancelAppointment(appointmentId);
  }
}
