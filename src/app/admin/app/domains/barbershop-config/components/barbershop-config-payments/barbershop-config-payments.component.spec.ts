import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarbershopConfigPaymentsComponent } from './barbershop-config-payments.component';

describe('BarbershopConfigPaymentsComponent', () => {
  let component: BarbershopConfigPaymentsComponent;
  let fixture: ComponentFixture<BarbershopConfigPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarbershopConfigPaymentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarbershopConfigPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
