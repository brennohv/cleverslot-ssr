import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { CustomRxjsService } from 'ba-ngrx-signal-based';
import { Observable } from 'rxjs';
import {
  BARBERSHOP_CONFIG_ADDRESS_CONTACT,
  UPDATE_ADDRESS,
  UPDATE_CONTACT,
} from '@admin/barbershop-config/data/graphql';
import {
  IGetAddressContactResponse,
  IGetAddressContactVariables,
  IUpdateAddressResponse,
  IUpdateAddressVariables,
  IUpdateContactResponse,
  IUpdateContactVariables,
} from '@admin/barbershop-config/data/types';

@Injectable({
  providedIn: 'root',
})
export class BarbershopConfigAddressContactService {
  private readonly customRxjs = inject(CustomRxjsService);
  private readonly apollo = inject(Apollo);

  constructor() {}

  getBarbershopAddressContact(
    barbershopId: string
  ): Observable<Apollo.QueryResult<IGetAddressContactResponse>> {
    return this.apollo
      .query<IGetAddressContactResponse, IGetAddressContactVariables>({
        query: BARBERSHOP_CONFIG_ADDRESS_CONTACT,
        fetchPolicy: 'network-only',
        variables: {
          documentId: barbershopId,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }

  updateAddress(
    params: IUpdateAddressVariables
  ): Observable<Apollo.MutateResult<IUpdateAddressResponse>> {
    return this.apollo
      .mutate<IUpdateAddressResponse, IUpdateAddressVariables>({
        mutation: UPDATE_ADDRESS,
        fetchPolicy: 'network-only',
        variables: {
          ...params,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }

  updateContact(
    params: IUpdateContactVariables
  ): Observable<Apollo.MutateResult<IUpdateContactResponse>> {
    return this.apollo
      .mutate<IUpdateContactResponse, IUpdateContactVariables>({
        mutation: UPDATE_CONTACT,
        fetchPolicy: 'network-only',
        variables: {
          ...params,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }
}
