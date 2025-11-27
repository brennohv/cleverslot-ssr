import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client/core';
import { IPaginationParams, CustomRxjsService } from 'ba-ngrx-signal-based';
import {
  IBarbershopListResponse,
  IBarbershopVariables,
} from '@client/barbershop-search/data/types';
import { BARBERSHOP_LIST } from '@client/barbershop-search/data/graphql';

@Injectable({
  providedIn: 'root',
})
export class BarbershopListService {
  private readonly customRxjs = inject(CustomRxjsService);
  private readonly apollo = inject(Apollo);

  constructor() {}

  getBarberShopList(
    name?: string,
    pagination?: IPaginationParams
  ): Observable<Apollo.QueryResult<IBarbershopListResponse>> {
    return this.apollo
      .query<IBarbershopListResponse, IBarbershopVariables>({
        query: BARBERSHOP_LIST,
        fetchPolicy: 'network-only',
        variables: {
          name: name,
          pagination,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }
}
