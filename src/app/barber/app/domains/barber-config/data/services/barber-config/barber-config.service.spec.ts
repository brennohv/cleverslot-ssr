import { TestBed } from '@angular/core/testing';

import { BarberConfigService } from './barber-config.service';

describe('BarberConfigService', () => {
  let service: BarberConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarberConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
