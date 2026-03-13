import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadProfileImageModalComponent } from './upload-profile-image-modal.component';

describe('UploadProfileImageModalComponent', () => {
  let component: UploadProfileImageModalComponent;
  let fixture: ComponentFixture<UploadProfileImageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadProfileImageModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadProfileImageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
