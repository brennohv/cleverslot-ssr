import { inject, Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client';
import {
  BARBERSHOP_CONFIG_BUSINESS_HOURS,
  UPDATE_BUSINESS_HOURS,
} from '@admin/barbershop-config/data/graphql';
import {
  IGetBusinessHoursResponse,
  IGetBusinessHoursVariables,
  IUpdateBusinessHoursResponse,
  IUpdateBusinessHourVariables,
} from '@admin/barbershop-config/data/types';
import { Apollo } from 'apollo-angular';
import { CustomRxjsService } from 'ba-ngrx-signal-based';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BarbershopConfigBusinessHoursService {
  private readonly customRxjs = inject(CustomRxjsService);
  private readonly apollo = inject(Apollo);

  getBarbershopBusinessHours(
    barbershopId: string
  ): Observable<Apollo.QueryResult<IGetBusinessHoursResponse>> {
    return this.apollo
      .query<IGetBusinessHoursResponse, IGetBusinessHoursVariables>({
        query: BARBERSHOP_CONFIG_BUSINESS_HOURS,
        fetchPolicy: 'network-only',
        variables: {
          documentId: barbershopId,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }

  updateBusinessHours(
    params: IUpdateBusinessHourVariables
  ): Observable<Apollo.MutateResult<IUpdateBusinessHoursResponse>> {
    return this.apollo
      .mutate<IUpdateBusinessHoursResponse, IUpdateBusinessHourVariables>({
        mutation: UPDATE_BUSINESS_HOURS,
        fetchPolicy: 'network-only',
        variables: {
          ...params,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }
}
