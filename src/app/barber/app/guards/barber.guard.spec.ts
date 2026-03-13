import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { BarberGuard } from './barber.guard';

describe('barberGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => BarberGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
