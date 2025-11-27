import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarbershopConfigBarberComponent } from './barbershop-config-barber.component';

describe('BarbershopConfigBarberComponent', () => {
  let component: BarbershopConfigBarberComponent;
  let fixture: ComponentFixture<BarbershopConfigBarberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarbershopConfigBarberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarbershopConfigBarberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
