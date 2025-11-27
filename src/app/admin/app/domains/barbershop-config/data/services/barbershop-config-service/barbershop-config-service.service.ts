import { inject, Injectable } from '@angular/core';
import {
  IBarbershopServiceListResponse,
  IBarbershopServiceVariables,
  ICreateServiceParams,
  ICreateServiceResponse,
  ICreateServiceVariables,
  IEnableDisableServiceResponse,
  IEnableDisableServiceVariables,
  IUpdateServiceParams,
  IUpdateServiceResponse,
  IUpdateServiceVariables,
} from '@admin/barbershop-config/data/types';
import { Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { CustomRxjsService } from 'ba-ngrx-signal-based';
import {
  BARBERSHOP_CONFIG_SERVICES,
  CREATE_SERVICE,
  ENABLE_DISABLE_SERVICE,
  UPDATE_SERVICE,
} from '@admin/barbershop-config/data/graphql';
import { GET_ALL_PROFESSIONALS } from '@admin/shared/data/graphql';
import {
  IProfessionalListResponse,
  IProfessionalListVariables,
} from '@admin/shared/data/types';

@Injectable({
  providedIn: 'root',
})
export class BarbershopConfigServiceService {
  private readonly customRxjs = inject(CustomRxjsService);
  private readonly apollo = inject(Apollo);

  constructor() {}

  getBarbershopServiceList(
    params: IBarbershopServiceVariables
  ): Observable<Apollo.QueryResult<IBarbershopServiceListResponse>> {
    return this.apollo
      .query<IBarbershopServiceListResponse, IBarbershopServiceVariables>({
        query: BARBERSHOP_CONFIG_SERVICES,
        fetchPolicy: 'network-only',
        variables: {
          ...(params.serviceName && { serviceName: params.serviceName }),
          barbershopId: params.barbershopId,
          pagination: params.pagination,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }

  enableDisableService(
    documentId: string,
    toggleValue: boolean
  ): Observable<Apollo.MutateResult<IEnableDisableServiceResponse>> {
    return this.apollo
      .mutate<IEnableDisableServiceResponse, IEnableDisableServiceVariables>({
        mutation: ENABLE_DISABLE_SERVICE,
        fetchPolicy: 'network-only',
        variables: {
          documentId,
          data: {
            isActive: toggleValue,
          },
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }

  updateService(
    params: IUpdateServiceParams
  ): Observable<Apollo.MutateResult<IUpdateServiceResponse>> {
    return this.apollo
      .mutate<IUpdateServiceResponse, IUpdateServiceVariables>({
        mutation: UPDATE_SERVICE,
        fetchPolicy: 'network-only',
        variables: {
          documentId: params.documentId,
          data: {
            isActive: params.isActive,
            duration: params.duration,
            name: params.name,
            recurrency: params.recurrency,
            value: params.value,
            professionalPercentage: params.professionalPercentage,
            barbers: params.barbers,
            ...(params.fileId && { photo: params.fileId }),
          },
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }

  createService(
    params: ICreateServiceParams
  ): Observable<Apollo.MutateResult<ICreateServiceResponse>> {
    return this.apollo
      .mutate<ICreateServiceResponse, ICreateServiceVariables>({
        mutation: CREATE_SERVICE,
        fetchPolicy: 'network-only',
        variables: {
          data: {
            isActive: true,
            duration: params.duration,
            name: params.name,
            recurrency: params.recurrency,
            value: params.value,
            professionalPercentage: params.professionalPercentage,
            barbershop: params.barbershopDocId,
            barbers: params.barbers,
            ...(params.fileId && { photo: params.fileId }),
          },
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }

  getAllProfessionals(
    barbershopId: string
  ): Observable<Apollo.QueryResult<IProfessionalListResponse>> {
    return this.apollo
      .query<IProfessionalListResponse, IProfessionalListVariables>({
        query: GET_ALL_PROFESSIONALS,
        fetchPolicy: 'network-only',
        variables: {
          barbershopId: barbershopId,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }
}
