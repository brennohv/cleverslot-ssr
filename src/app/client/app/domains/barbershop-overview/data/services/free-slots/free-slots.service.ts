import { Injectable, inject } from '@angular/core';
import {
  CustomRxjsService,
  GeneralAppointmentsService,
  IFreeSlotsResponse,
  ICreateAppointmentResponse,
  ICreateAppointmentParams,
  IFreeSlotsParams,
} from 'ba-ngrx-signal-based';
import { Apollo } from 'apollo-angular';

import { Observable } from 'rxjs';
import {
  IBarberListFreeSlotsResponse,
  IBarberListFreeSlotsVariables,
} from '@client/barbershop-overview/data/types';
import { PROFESSIONAL_LIST_BY_SERVICE } from '@client/barbershop-overview/data/graphql';

@Injectable({
  providedIn: 'root',
})
export class FreeSlotsService {
  private readonly customRxjs = inject(CustomRxjsService);
  private readonly apollo = inject(Apollo);
  #generalAppointment = inject(GeneralAppointmentsService);

  getBarbersFromBarbershopByServiceId(
    serviceId: string,
    barbershopId: string
  ): Observable<Apollo.QueryResult<IBarberListFreeSlotsResponse>> {
    return this.apollo
      .query<IBarberListFreeSlotsResponse, IBarberListFreeSlotsVariables>({
        query: PROFESSIONAL_LIST_BY_SERVICE,
        fetchPolicy: 'network-only',
        variables: {
          barbershopId: barbershopId,
          serviceId: serviceId,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }

  getFreeSlots(
    params: IFreeSlotsParams
  ): Observable<Apollo.QueryResult<IFreeSlotsResponse>> {
    return this.#generalAppointment.getFreeSlots(params);
  }

  bookAppointment(
    params: ICreateAppointmentParams
  ): Observable<Apollo.MutateResult<ICreateAppointmentResponse>> {
    return this.#generalAppointment.bookAppointment(params);
  }
}
