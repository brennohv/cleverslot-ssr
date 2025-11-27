import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client/core';
import { CustomRxjsService } from 'ba-ngrx-signal-based';
import { Observable } from 'rxjs';
import { BARBERSHOP_CLIENTS } from '@admin/barbershop-config/data/graphql';
import {
  IClientListResponse,
  IClientListVariables,
} from '@admin/barbershop-config/data/types';

@Injectable({
  providedIn: 'root',
})
export class BarbershopConfigClientsService {
  private readonly customRxjs = inject(CustomRxjsService);
  private readonly apollo = inject(Apollo);
  constructor() {}

  getClientList(
    params: IClientListVariables
  ): Observable<Apollo.QueryResult<IClientListResponse>> {
    return this.apollo
      .query<IClientListResponse, IClientListVariables>({
        query: BARBERSHOP_CLIENTS,
        fetchPolicy: 'network-only',
        variables: {
          barbershopId: params.barbershopId,
          ...(params.identifier && { identifier: params.identifier }),
          ...(params.pagination && { pagination: params.pagination }),
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }
}
