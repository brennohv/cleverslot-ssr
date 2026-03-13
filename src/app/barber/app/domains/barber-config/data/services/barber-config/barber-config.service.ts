import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client/core';
import {
  CustomRxjsService,
  UploadFileService,
  IUploadFileVariables,
  IUploadFile,
} from 'ba-ngrx-signal-based';
import { Apollo } from 'apollo-angular';
import {
  BARBER_CONFIG_SERVICES,
  BARBER_PROFILE,
  UPDATE_BARBER_CONFIG_NAME,
  UPDATE_BARBER_CONFIG_SERVICES,
} from '@barber/barber-config/data/graphql';
import {
  IBarberAppointmenVariables,
  IBarberProfileResponse,
  IBarbershopServiceListResponse,
  IBarbershopServiceVariables,
  IUpdatebarberNameResponse,
  IUpdatebarberNameVariables,
  IUpdatebarberServiceResponse,
  IUpdatebarberServicVariables,
} from '@barber/barber-config/data/types';

@Injectable({
  providedIn: 'root',
})
export class BarberConfigService {
  private readonly customRxjs = inject(CustomRxjsService);
  private readonly apollo = inject(Apollo);
  private readonly uploadFileService = inject(UploadFileService);

  constructor() {}

  getBarberProfile(
    barberId: string,
  ): Observable<Apollo.QueryResult<IBarberProfileResponse>> {
    return this.apollo
      .query<IBarberProfileResponse, IBarberAppointmenVariables>({
        query: BARBER_PROFILE,
        fetchPolicy: 'network-only',
        variables: {
          barberId: barberId,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }

  getBarbershopServiceList(
    params: IBarbershopServiceVariables,
  ): Observable<Apollo.QueryResult<IBarbershopServiceListResponse>> {
    return this.apollo
      .query<IBarbershopServiceListResponse, IBarbershopServiceVariables>({
        query: BARBER_CONFIG_SERVICES,
        fetchPolicy: 'network-only',
        variables: {
          ...(params.serviceName && { serviceName: params.serviceName }),
          barbershopId: params.barbershopId,
          pagination: params.pagination,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }

  updateBarberServices(
    params: IUpdatebarberServicVariables,
  ): Observable<Apollo.MutateResult<IUpdatebarberServiceResponse>> {
    return this.apollo
      .mutate<IUpdatebarberServiceResponse, IUpdatebarberServicVariables>({
        mutation: UPDATE_BARBER_CONFIG_SERVICES,
        fetchPolicy: 'network-only',
        variables: {
          barberId: params.barberId,
          data: params.data,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }

  updateBarberName(
    params: IUpdatebarberNameVariables,
  ): Observable<Apollo.MutateResult<IUpdatebarberNameResponse>> {
    return this.apollo
      .mutate<IUpdatebarberNameResponse, IUpdatebarberNameVariables>({
        mutation: UPDATE_BARBER_CONFIG_NAME,
        fetchPolicy: 'network-only',
        variables: {
          barberId: params.barberId,
          data: params.data,
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }

  uploadBarberPhoto(
    variables: IUploadFileVariables,
  ): Observable<IUploadFile[]> {
    return this.uploadFileService.uploadFile(variables);
  }

  deleteBarberPhoto(id: string): Observable<IUploadFile> {
    return this.uploadFileService.deleteFile(id);
  }
}
