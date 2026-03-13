import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentDetailedDialogComponent } from './appointment-detailed-dialog.component';

describe('AppointmentDetailedDialogComponent', () => {
  let component: AppointmentDetailedDialogComponent;
  let fixture: ComponentFixture<AppointmentDetailedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentDetailedDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppointmentDetailedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
