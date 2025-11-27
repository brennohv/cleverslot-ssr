import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarbershopConfigHeaderComponent } from './barbershop-config-header.component';

describe('BarbershopConfigHeaderComponent', () => {
  let component: BarbershopConfigHeaderComponent;
  let fixture: ComponentFixture<BarbershopConfigHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarbershopConfigHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarbershopConfigHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
