import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CustomRxjsService } from 'ba-ngrx-signal-based';
import { Observable } from 'rxjs';
import {
  BARBERSHOP_CONFIG_BRAND,
  UPDATE_BRAND,
} from '@admin/barbershop-config/data/graphql';
import {
  IGetBrandResponse,
  IGetBrandVariables,
  IUpdateBrandResponse,
  IUpdateBrandVariables,
} from '@admin/barbershop-config/data/types';

@Injectable({
  providedIn: 'root',
})
export class BarbershopConfigBrandService {
  private readonly customRxjs = inject(CustomRxjsService);
  private readonly apollo = inject(Apollo);

  getBarbershopBrand(
    barbershopId: string
  ): Observable<Apollo.QueryResult<IGetBrandResponse>> {
    return this.apollo
      .query<IGetBrandResponse, IGetBrandVariables>({
        query: BARBERSHOP_CONFIG_BRAND,
        fetchPolicy: 'network-only',
        variables: {
          documentId: barbershopId,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }

  updateBarbershopBrand(
    params: IUpdateBrandVariables
  ): Observable<Apollo.MutateResult<IUpdateBrandResponse>> {
    return this.apollo
      .mutate<IUpdateBrandResponse, IUpdateBrandVariables>({
        mutation: UPDATE_BRAND,
        fetchPolicy: 'network-only',
        variables: {
          ...params,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }
}
