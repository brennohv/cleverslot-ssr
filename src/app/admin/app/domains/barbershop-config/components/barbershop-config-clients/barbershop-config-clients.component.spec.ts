import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarbershopConfigClientsComponent } from './barbershop-config-clients.component';

describe('BarbershopConfigClientsComponent', () => {
  let component: BarbershopConfigClientsComponent;
  let fixture: ComponentFixture<BarbershopConfigClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarbershopConfigClientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarbershopConfigClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
