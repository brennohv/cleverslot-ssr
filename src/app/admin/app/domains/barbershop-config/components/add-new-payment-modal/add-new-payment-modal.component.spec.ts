import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPaymentModalComponent } from './add-new-payment-modal.component';

describe('AddNewPaymentModalComponent', () => {
  let component: AddNewPaymentModalComponent;
  let fixture: ComponentFixture<AddNewPaymentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewPaymentModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNewPaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
