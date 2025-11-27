import { TestBed } from '@angular/core/testing';

import { BarbershopConfigServiceService } from './barbershop-config-service.service';

describe('BarbershopConfigServiceService', () => {
  let service: BarbershopConfigServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarbershopConfigServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
