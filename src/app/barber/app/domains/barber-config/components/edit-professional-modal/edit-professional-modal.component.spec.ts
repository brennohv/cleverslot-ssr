import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfessionalModalComponent } from './edit-professional-modal.component';

describe('EditProfessionalModalComponent', () => {
  let component: EditProfessionalModalComponent;
  let fixture: ComponentFixture<EditProfessionalModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProfessionalModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditProfessionalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
