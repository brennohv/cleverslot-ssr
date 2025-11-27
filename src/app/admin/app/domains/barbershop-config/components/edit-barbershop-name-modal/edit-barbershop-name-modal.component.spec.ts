import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBarbershopNameModalComponent } from './edit-barbershop-name-modal.component';

describe('EditBarbershopNameModalComponent', () => {
  let component: EditBarbershopNameModalComponent;
  let fixture: ComponentFixture<EditBarbershopNameModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBarbershopNameModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBarbershopNameModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
