import { inject, Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import {
  BARBERSHOP_CONFIG_PAYMENTS,
  UPDATE_PAYMENTS,
} from '@admin/barbershop-config/data/graphql';
import {
  IGetPaymentListResponse,
  IUpdatePaymentsVariables,
  IUpdatePaymentListResponse,
  IGetPaymentsVariables,
} from '@admin/barbershop-config/data/types';
import { Apollo } from 'apollo-angular';
import { CustomRxjsService } from 'ba-ngrx-signal-based';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BarbershopConfigPaymentsService {
  private readonly customRxjs = inject(CustomRxjsService);
  private readonly apollo = inject(Apollo);

  constructor() {}

  updatePayments(
    params: IUpdatePaymentsVariables
  ): Observable<Apollo.MutateResult<IUpdatePaymentListResponse>> {
    return this.apollo
      .mutate<IUpdatePaymentListResponse, IUpdatePaymentsVariables>({
        mutation: UPDATE_PAYMENTS,
        fetchPolicy: 'network-only',
        variables: {
          ...params,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }

  getBarbershopPayments(
    documentId: string
  ): Observable<Apollo.QueryResult<IGetPaymentListResponse>> {
    return this.apollo
      .query<IGetPaymentListResponse, IGetPaymentsVariables>({
        query: BARBERSHOP_CONFIG_PAYMENTS,
        fetchPolicy: 'network-only',
        variables: {
          documentId,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }
}
