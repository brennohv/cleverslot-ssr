import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarbershopConfigBusinessHoursComponent } from './barbershop-config-business-hours.component';

describe('BarbershopConfigBusinessHoursComponent', () => {
  let component: BarbershopConfigBusinessHoursComponent;
  let fixture: ComponentFixture<BarbershopConfigBusinessHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarbershopConfigBusinessHoursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarbershopConfigBusinessHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
