import { TestBed } from '@angular/core/testing';

import { BarbershopConfigNavService } from './barbershop-config-nav.service';

describe('BarbershopConfigNavService', () => {
  let service: BarbershopConfigNavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarbershopConfigNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
