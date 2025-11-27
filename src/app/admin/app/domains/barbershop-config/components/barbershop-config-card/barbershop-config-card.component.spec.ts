import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarbershopConfigCardComponent } from './barbershop-config-card.component';

describe('BarbershopConfigCardComponent', () => {
  let component: BarbershopConfigCardComponent;
  let fixture: ComponentFixture<BarbershopConfigCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarbershopConfigCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarbershopConfigCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
