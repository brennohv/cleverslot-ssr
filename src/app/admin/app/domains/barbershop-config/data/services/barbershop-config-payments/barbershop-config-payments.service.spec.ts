import { TestBed } from '@angular/core/testing';

import { BarbershopConfigPaymentsService } from './barbershop-config-payments.service';

describe('BarbershopConfigPaymentsService', () => {
  let service: BarbershopConfigPaymentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarbershopConfigPaymentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
