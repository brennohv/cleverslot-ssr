import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewServiceModalComponent } from './add-new-service-modal.component';

describe('AddNewServiceModalComponent', () => {
  let component: AddNewServiceModalComponent;
  let fixture: ComponentFixture<AddNewServiceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewServiceModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNewServiceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
