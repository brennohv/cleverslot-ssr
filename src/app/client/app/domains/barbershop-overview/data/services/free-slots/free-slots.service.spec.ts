import { TestBed } from '@angular/core/testing';

import { FreeSlotsService } from './free-slots.service';

describe('FreeSlotsService', () => {
  let service: FreeSlotsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FreeSlotsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
