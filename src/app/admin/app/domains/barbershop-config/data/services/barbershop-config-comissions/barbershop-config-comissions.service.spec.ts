import { TestBed } from '@angular/core/testing';

import { BarbershopConfigComissionsService } from './barbershop-config-comissions.service';

describe('BarbershopConfigComissionsService', () => {
  let service: BarbershopConfigComissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarbershopConfigComissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
