import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { makeStateKey, TransferState } from '@angular/core';
import { BarbershopListService } from '@client/barbershop-search/data/services';
import {
  IBarbershopListResponse,
  IBarbershopSearch,
} from '@client/barbershop-search/data/types';
import { IPagination } from 'ba-ngrx-signal-based';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface BarbershopListResolverData {
  barbershops: IBarbershopSearch[];
  pageInfo: IPagination;
}

const BARBERSHOP_LIST_KEY = makeStateKey<BarbershopListResolverData | null>(
  'barbershopList'
);

export const barbershopListResolver: ResolveFn<
  BarbershopListResolverData | null
> = (): Observable<BarbershopListResolverData | null> => {
  const barbershopListService = inject(BarbershopListService);
  const transferState = inject(TransferState);

  // Check if data exists in TransferState (from SSR)
  const cachedData = transferState.get(BARBERSHOP_LIST_KEY, null);

  if (cachedData) {
    // Remove from TransferState to free memory
    transferState.remove(BARBERSHOP_LIST_KEY);
    return of(cachedData);
  }

  // Fetch data and store in TransferState for browser hydration
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
      tap((data) => {
        if (data) {
          transferState.set(BARBERSHOP_LIST_KEY, data);
        }
      }),
      catchError((error) => {
        console.error('Error loading barbershops:', error);
        return of(null);
      })
    );
};
