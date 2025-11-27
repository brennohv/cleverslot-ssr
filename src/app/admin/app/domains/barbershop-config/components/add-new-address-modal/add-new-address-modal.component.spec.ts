import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewAddressModalComponent } from './add-new-address-modal.component';

describe('AddNewAddressModalComponent', () => {
  let component: AddNewAddressModalComponent;
  let fixture: ComponentFixture<AddNewAddressModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewAddressModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNewAddressModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
