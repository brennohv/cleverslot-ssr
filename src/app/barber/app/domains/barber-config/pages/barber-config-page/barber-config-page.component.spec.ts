import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberConfigPageComponent } from './barber-config-page.component';

describe('BarberConfigPageComponent', () => {
  let component: BarberConfigPageComponent;
  let fixture: ComponentFixture<BarberConfigPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarberConfigPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarberConfigPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
