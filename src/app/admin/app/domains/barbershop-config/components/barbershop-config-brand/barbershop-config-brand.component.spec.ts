import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarbershopConfigBrandComponent } from './barbershop-config-brand.component';

describe('BarbershopConfigBrandComponent', () => {
  let component: BarbershopConfigBrandComponent;
  let fixture: ComponentFixture<BarbershopConfigBrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarbershopConfigBrandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarbershopConfigBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
