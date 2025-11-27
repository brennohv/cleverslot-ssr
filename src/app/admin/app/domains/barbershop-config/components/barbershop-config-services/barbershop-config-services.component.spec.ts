import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarbershopConfigServicesComponent } from './barbershop-config-services.component';

describe('BarbershopConfigServicesComponent', () => {
  let component: BarbershopConfigServicesComponent;
  let fixture: ComponentFixture<BarbershopConfigServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarbershopConfigServicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarbershopConfigServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
