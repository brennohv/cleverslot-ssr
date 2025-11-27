import { TestBed } from '@angular/core/testing';

import { BarbershopConfigBrandService } from './barbershop-config-brand.service';

describe('BarbershopConfigBrandService', () => {
  let service: BarbershopConfigBrandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarbershopConfigBrandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
