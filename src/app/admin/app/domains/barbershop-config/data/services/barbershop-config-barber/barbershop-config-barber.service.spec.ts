import { TestBed } from '@angular/core/testing';

import { BarbershopConfigBarberService } from './barbershop-config-barber.service';

describe('BarbershopConfigBarberService', () => {
  let service: BarbershopConfigBarberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarbershopConfigBarberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
