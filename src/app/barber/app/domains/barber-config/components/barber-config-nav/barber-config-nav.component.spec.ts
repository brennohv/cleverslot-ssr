import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberConfigNavComponent } from './barber-config-nav.component';

describe('BarberConfigNavComponent', () => {
  let component: BarberConfigNavComponent;
  let fixture: ComponentFixture<BarberConfigNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarberConfigNavComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarberConfigNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
