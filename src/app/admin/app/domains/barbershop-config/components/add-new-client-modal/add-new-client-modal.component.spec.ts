import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewClientModalComponent } from './add-new-client-modal.component';

describe('AddNewClientModalComponent', () => {
  let component: AddNewClientModalComponent;
  let fixture: ComponentFixture<AddNewClientModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewClientModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewClientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
