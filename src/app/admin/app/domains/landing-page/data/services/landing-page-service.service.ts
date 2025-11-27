import { Inject, inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  CustomRxjsService,
  IEnvironment,
  LIBRARY_ENV,
} from 'ba-ngrx-signal-based';
import { Observable } from 'rxjs';
import { MUTATION_CREATE_BARBERSHOP } from '@admin/landing-page/data/graphql';
import { StripeService } from '@admin/shared/data/services';

@Injectable({
  providedIn: 'root',
})
export class LandingPageServiceService {
  private readonly apollo = inject(Apollo);
  private readonly customRxjs = inject(CustomRxjsService);
  private readonly stripeService = inject(StripeService);

  constructor(@Inject(LIBRARY_ENV) private env: IEnvironment) {}

  createBarbershop(
    name: string
  ): Observable<Apollo.MutateResult<ICreateBarbershopResponse>> {
    return this.apollo
      .mutate<ICreateBarbershopResponse, { data: { name: string } }>({
        mutation: MUTATION_CREATE_BARBERSHOP,
        variables: {
          data: {
            name,
          },
        },
      })
      .pipe(this.customRxjs.catchAndReturnError());
  }
}

export type ICreateBarbershopResponse = {
  createBarbershop: {
    documentId: string;
    slug: string;
    name: string;
    admins: [
      {
        documentId: string;
      }
    ];
  };
};
