import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarbershopFullCalendarComponent } from './barbershop-full-calendar.component';

describe('BarbershopFullCalendarComponent', () => {
  let component: BarbershopFullCalendarComponent;
  let fixture: ComponentFixture<BarbershopFullCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarbershopFullCalendarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarbershopFullCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
