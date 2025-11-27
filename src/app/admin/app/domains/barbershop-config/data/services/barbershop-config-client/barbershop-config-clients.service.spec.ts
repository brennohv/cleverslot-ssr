import { TestBed } from '@angular/core/testing';

import { BarbershopConfigClientsService } from './barbershop-config-clients.service';

describe('BarbershopConfigClientsService', () => {
  let service: BarbershopConfigClientsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarbershopConfigClientsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
