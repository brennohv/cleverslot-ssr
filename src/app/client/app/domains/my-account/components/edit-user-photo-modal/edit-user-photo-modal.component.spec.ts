import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserPhotoModalComponent } from './edit-user-photo-modal.component';

describe('EditUserPhotoModalComponent', () => {
  let component: EditUserPhotoModalComponent;
  let fixture: ComponentFixture<EditUserPhotoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditUserPhotoModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditUserPhotoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
