import { TestBed } from '@angular/core/testing';

import { BarbershopBySlugService } from './barbershop-by-slug.service';

describe('BarbershopBySlugService', () => {
  let service: BarbershopBySlugService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarbershopBySlugService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
