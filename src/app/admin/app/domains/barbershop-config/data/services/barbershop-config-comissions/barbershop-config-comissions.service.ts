import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client/core';
import { CustomRxjsService } from 'ba-ngrx-signal-based';
import { Apollo } from 'apollo-angular';
import {
  IBarberListVariables,
  IBarbershopComissionsParams,
  IBarbershopComissionsResponse,
  IBarbershopComissionsVariables,
  IGetBarberListResponse,
} from '@admin/barbershop-config/data/types';
import {
  BARBERSHOP_BARBER_COMISSIONS,
  PROFESSIONAL_LIST,
} from '@admin/barbershop-config/data/graphql';

@Injectable({
  providedIn: 'root',
})
export class BarbershopConfigComissionsService {
  private readonly customRxjs = inject(CustomRxjsService);
  private readonly apollo = inject(Apollo);

  constructor() {}

  getBarberComissions(
    params: IBarbershopComissionsParams
  ): Observable<Apollo.QueryResult<IBarbershopComissionsResponse>> {
    return this.apollo
      .query<IBarbershopComissionsResponse, IBarbershopComissionsVariables>({
        query: BARBERSHOP_BARBER_COMISSIONS,
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

  getBarberList(
    barbershopId: string
  ): Observable<Apollo.QueryResult<IGetBarberListResponse>> {
    return this.apollo
      .query<IGetBarberListResponse, IBarberListVariables>({
        query: PROFESSIONAL_LIST,
        fetchPolicy: 'network-only',
        variables: {
          barbershopId: barbershopId,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }
}
