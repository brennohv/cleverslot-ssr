import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewBarberModalComponent } from './add-new-barber-modal.component';

describe('AddNewBarberModalComponent', () => {
  let component: AddNewBarberModalComponent;
  let fixture: ComponentFixture<AddNewBarberModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewBarberModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewBarberModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
