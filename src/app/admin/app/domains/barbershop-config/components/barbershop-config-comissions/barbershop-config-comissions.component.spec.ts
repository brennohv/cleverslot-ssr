import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarbershopConfigComissionsComponent } from './barbershop-config-comissions.component';

describe('BarbershopConfigComissionsComponent', () => {
  let component: BarbershopConfigComissionsComponent;
  let fixture: ComponentFixture<BarbershopConfigComissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarbershopConfigComissionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarbershopConfigComissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
