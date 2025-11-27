import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBarbershopImageModalComponent } from './upload-barbershop-image-modal.component';

describe('UploadBarbershopImageModalComponent', () => {
  let component: UploadBarbershopImageModalComponent;
  let fixture: ComponentFixture<UploadBarbershopImageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadBarbershopImageModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadBarbershopImageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
