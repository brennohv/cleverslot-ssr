import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarbershopConfigAddressContactComponent } from './barbershop-config-address-contact.component';

describe('BarbershopConfigAddressContactComponent', () => {
  let component: BarbershopConfigAddressContactComponent;
  let fixture: ComponentFixture<BarbershopConfigAddressContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarbershopConfigAddressContactComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarbershopConfigAddressContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
