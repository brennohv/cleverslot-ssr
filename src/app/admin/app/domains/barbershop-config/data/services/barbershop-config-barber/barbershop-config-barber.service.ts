import { inject, Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client';
import {
  BARBERSHOP_CONFIG_BARBER,
  BARBERSHOP_SUBSCRIPTION_PLAN,
  CREATE_BARBER,
  DELETE_BARBER,
} from '@admin/barbershop-config/data/graphql';
import {
  ICreateBarberResponse,
  ICreateBarberVariables,
  IBarberCollectionResponse,
  IGetBarbershopBarberVariables,
  IDeleteBarberResponse,
  IDeleteBarberVariables,
  IGetBarbershopSubscriptionPlan,
} from '@admin/barbershop-config/data/types';
import { Apollo } from 'apollo-angular';
import { CustomRxjsService } from 'ba-ngrx-signal-based';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BarbershopConfigBarberService {
  private readonly customRxjs = inject(CustomRxjsService);
  private readonly apollo = inject(Apollo);
  constructor() {}

  getBarbershopBarbers(
    params: IGetBarbershopBarberVariables
  ): Observable<Apollo.QueryResult<IBarberCollectionResponse>> {
    return this.apollo
      .query<IBarberCollectionResponse, IGetBarbershopBarberVariables>({
        query: BARBERSHOP_CONFIG_BARBER,
        fetchPolicy: 'network-only',
        variables: {
          ...params,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }

  getBarbershopSubscriptionPlan(
    params: IGetBarbershopBarberVariables
  ): Observable<Apollo.QueryResult<IGetBarbershopSubscriptionPlan>> {
    return this.apollo
      .query<IGetBarbershopSubscriptionPlan, IGetBarbershopBarberVariables>({
        query: BARBERSHOP_SUBSCRIPTION_PLAN,
        fetchPolicy: 'network-only',
        variables: {
          ...params,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }

  createBarber(
    params: ICreateBarberVariables
  ): Observable<Apollo.MutateResult<ICreateBarberResponse>> {
    return this.apollo
      .mutate<ICreateBarberResponse, ICreateBarberVariables>({
        mutation: CREATE_BARBER,
        fetchPolicy: 'network-only',
        variables: {
          ...params,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }

  deleteBarber(
    barberDocId: string
  ): Observable<Apollo.MutateResult<IDeleteBarberResponse>> {
    return this.apollo
      .mutate<IDeleteBarberResponse, IDeleteBarberVariables>({
        mutation: DELETE_BARBER,
        fetchPolicy: 'network-only',
        variables: {
          documentId: barberDocId,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }
}
