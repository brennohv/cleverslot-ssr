import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarbershopSchedulePageComponent } from './barbershop-schedule-page.component';

describe('BarbershopSchedulePageComponent', () => {
  let component: BarbershopSchedulePageComponent;
  let fixture: ComponentFixture<BarbershopSchedulePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarbershopSchedulePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BarbershopSchedulePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
