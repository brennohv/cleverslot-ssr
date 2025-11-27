import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewAppointmentDialogComponent } from './add-new-appointment-dialog.component';

describe('AddNewAppointmentDialogComponent', () => {
  let component: AddNewAppointmentDialogComponent;
  let fixture: ComponentFixture<AddNewAppointmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewAppointmentDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNewAppointmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
