import { TestBed } from '@angular/core/testing';

import { BarberConfigNavService } from './barber-config-nav.service';

describe('BarberConfigNavService', () => {
  let service: BarberConfigNavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarberConfigNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
