import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberConfigServicesComponent } from './barber-config-services.component';

describe('BarberConfigServicesComponent', () => {
  let component: BarberConfigServicesComponent;
  let fixture: ComponentFixture<BarberConfigServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarberConfigServicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarberConfigServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
