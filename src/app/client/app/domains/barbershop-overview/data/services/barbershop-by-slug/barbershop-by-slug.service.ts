import { Injectable, inject } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { CustomRxjsService } from 'ba-ngrx-signal-based';
import {
  BARBERSHOP_BY_SLUG,
  BARBERSHOP_SERVICES,
} from '@client/barbershop-overview/data/graphql';
import {
  IBarbershopBySlug,
  IBarbershopBySlugListResponse,
  IBarbershopBySlugVariables,
  IBarbershopServiceListResponse,
  IBarbershopServiceVariables,
} from '@client/barbershop-overview/data/types';

@Injectable({
  providedIn: 'root',
})
export class BarbershopBySlugService {
  private readonly customRxjs = inject(CustomRxjsService);
  private readonly apollo = inject(Apollo);
  constructor() {}

  getBarberShopBySlug(
    slug: string
  ): Observable<Apollo.QueryResult<IBarbershopBySlug | null>> {
    return this.apollo
      .query<IBarbershopBySlugListResponse, IBarbershopBySlugVariables>({
        query: BARBERSHOP_BY_SLUG,
        fetchPolicy: 'network-only',
        variables: {
          slug: slug,
        },
      })
      .pipe(
        this.customRxjs.catchAndReturnError(),
        map((resp) => {
          return {
            ...resp,
            data: resp.data?.barbershops?.[0] || null,
          };
        })
      );
  }

  getBarbershopServiceList(
    params: IBarbershopServiceVariables
  ): Observable<Apollo.QueryResult<IBarbershopServiceListResponse>> {
    return this.apollo
      .query<IBarbershopServiceListResponse, IBarbershopServiceVariables>({
        query: BARBERSHOP_SERVICES,
        fetchPolicy: 'network-only',
        variables: {
          ...(params.serviceName && { serviceName: params.serviceName }),
          barbershopId: params.barbershopId,
          pagination: params.pagination,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }
}
