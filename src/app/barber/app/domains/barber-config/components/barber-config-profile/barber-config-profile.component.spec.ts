import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberConfigProfileComponent } from './barber-config-profile.component';

describe('BarberConfigProfileComponent', () => {
  let component: BarberConfigProfileComponent;
  let fixture: ComponentFixture<BarberConfigProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarberConfigProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarberConfigProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
