import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarbeshopConfigNavComponent } from './barbeshop-config-nav.component';

describe('BarbeshopConfigNavComponent', () => {
  let component: BarbeshopConfigNavComponent;
  let fixture: ComponentFixture<BarbeshopConfigNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarbeshopConfigNavComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BarbeshopConfigNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
