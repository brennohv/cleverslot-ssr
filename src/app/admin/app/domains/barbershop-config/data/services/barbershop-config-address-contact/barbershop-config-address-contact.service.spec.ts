import { TestBed } from '@angular/core/testing';

import { BarbershopConfigAddressContactService } from './barbershop-config-address-contact.service';

describe('BarbershopConfigAddressContactService', () => {
  let service: BarbershopConfigAddressContactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarbershopConfigAddressContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
