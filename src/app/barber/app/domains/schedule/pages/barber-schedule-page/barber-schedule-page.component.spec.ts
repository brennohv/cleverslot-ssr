import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberSchedulePageComponent } from './barber-schedule-page.component';

describe('BarberSchedulePageComponent', () => {
  let component: BarberSchedulePageComponent;
  let fixture: ComponentFixture<BarberSchedulePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarberSchedulePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarberSchedulePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
