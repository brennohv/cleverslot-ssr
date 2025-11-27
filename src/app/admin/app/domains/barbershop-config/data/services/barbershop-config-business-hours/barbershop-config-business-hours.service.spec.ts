import { TestBed } from '@angular/core/testing';

import { BarbershopConfigBusinessHoursService } from './barbershop-config-business-hours.service';

describe('BarbershopConfigBusinessHoursService', () => {
  let service: BarbershopConfigBusinessHoursService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarbershopConfigBusinessHoursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
