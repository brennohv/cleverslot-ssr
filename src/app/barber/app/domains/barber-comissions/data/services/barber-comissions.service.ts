import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client/core';
import { CustomRxjsService } from 'ba-ngrx-signal-based';
import { Apollo } from 'apollo-angular';
import { BARBER_COMISSIONS } from '@barber/barber-comissions/data/graphql';
import {
  IBarberComissionsParams,
  IBarberComissionsResponse,
  IBarberComissionsVariables,
} from '../types';

@Injectable({
  providedIn: 'root',
})
export class BarberComissionsService {
  private readonly customRxjs = inject(CustomRxjsService);
  private readonly apollo = inject(Apollo);

  constructor() {}

  getBarberComissions(
    params: IBarberComissionsParams,
  ): Observable<Apollo.QueryResult<IBarberComissionsResponse>> {
    return this.apollo
      .query<IBarberComissionsResponse, IBarberComissionsVariables>({
        query: BARBER_COMISSIONS,
        fetchPolicy: 'network-only',
        variables: {
          data: {
            barberId: params.barberId,
            barbershopId: params.barbershopId,
            dateStart: params.dateStart,
            dateEnd: params.dateEnd,
          },
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }
}
