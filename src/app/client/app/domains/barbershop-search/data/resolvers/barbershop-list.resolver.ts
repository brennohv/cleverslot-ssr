import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { BarbershopListService } from '@client/barbershop-search/data/services';
import {
  IBarbershopListResponse,
  IBarbershopSearch,
} from '@client/barbershop-search/data/types';
import { IPagination } from 'ba-ngrx-signal-based';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface BarbershopListResolverData {
  barbershops: IBarbershopSearch[];
  pageInfo: IPagination;
}

export const barbershopListResolver: ResolveFn<
  BarbershopListResolverData | null
> = (): Observable<BarbershopListResolverData | null> => {
  const barbershopListService = inject(BarbershopListService);

  return barbershopListService
    .getBarberShopList('', { page: 1, pageSize: 10 })
    .pipe(
      map((resp) => {
        if (resp.data) {
          return {
            barbershops: resp.data.barbershops_connection.nodes,
            pageInfo: resp.data.barbershops_connection.pageInfo,
          };
        }
        return null;
      }),
      catchError((error) => {
        console.error('Error loading barbershops:', error);
        return of(null);
      })
    );
};
