import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarbershopConfigPageComponent } from './barbershop-config-page.component';

describe('BarbershopConfigPageComponent', () => {
  let component: BarbershopConfigPageComponent;
  let fixture: ComponentFixture<BarbershopConfigPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarbershopConfigPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarbershopConfigPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
