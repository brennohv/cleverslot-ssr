import { TestBed } from '@angular/core/testing';

import { BarbershopListService } from './barbershop-list.service';

describe('BarbershopListService', () => {
  let service: BarbershopListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarbershopListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
